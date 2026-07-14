import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BOUNDS = {
  south: 10.72,
  west: 106.62,
  north: 10.762,
  east: 106.7,
};

const bbox = `${BOUNDS.south},${BOUNDS.west},${BOUNDS.north},${BOUNDS.east}`;
const corridorNames =
  "^(\u0110ường |Cầu |Đại lộ )?(Tạ Quang Bửu|Hậu Giang|Minh Phụng|Chợ Lớn|Phạm Hùng|Nguyễn Văn Linh|Dương Bá Trạc|Nguyễn Văn Cừ|Quốc lộ 50)$";
const canonicalCorridors = new Set([
  "Tạ Quang Bửu",
  "Hậu Giang",
  "Minh Phụng",
  "Chợ Lớn",
  "Phạm Hùng",
  "Nguyễn Văn Linh",
  "Dương Bá Trạc",
  "Nguyễn Văn Cừ",
  "Quốc lộ 50",
]);
const endpoint =
  process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";
const query = `[out:json][timeout:120];
(
  way["highway"~"^(motorway|motorway_link|trunk|trunk_link|primary|primary_link|secondary|secondary_link|tertiary|tertiary_link)$"](${bbox});
  way["highway"]["name"~"${corridorNames}",i](${bbox});
  way["highway"]["ref"~"^(QL ?50|50)$",i](${bbox});
  way["waterway"~"^(river|canal|stream|drain)$"](${bbox});
  way["natural"="water"](${bbox});
  way["landuse"="reservoir"](${bbox});
  way["leisure"~"^(park|garden)$"](${bbox});
);
out tags geom(${bbox});`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "user-agent":
      "Agribank-Branch-Map/1.0 (+https://agribank-chi-nhanh-8-map.vodangthinh4.chatgpt.site)",
  },
  body: new URLSearchParams({ data: query }),
});

if (!response.ok) {
  const detail = (await response.text()).replace(/\s+/g, " ").slice(0, 240);
  throw new Error(`Overpass returned ${response.status}: ${detail}`);
}

const data = await response.json();
const features = data.elements
  .map(toFeature)
  .filter(Boolean)
  .sort(compareFeatures);

const featureCollection = {
  type: "FeatureCollection",
  metadata: {
    source: "OpenStreetMap contributors",
    license: "ODbL-1.0",
    sourceUrl: "https://www.openstreetmap.org/copyright",
    generatedFrom: data.osm3s?.timestamp_osm_base ?? null,
    bounds: [BOUNDS.west, BOUNDS.south, BOUNDS.east, BOUNDS.north],
  },
  features,
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "public/data/branch-network.geojson");
await mkdir(dirname(outputPath), { recursive: true });
const output = `${JSON.stringify(featureCollection)}\n`;
await writeFile(outputPath, output, "utf8");

const counts = features.reduce((result, feature) => {
  const key = `${feature.properties.kind}:${feature.properties.class}`;
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});

console.log(
  JSON.stringify(
    {
      outputPath,
      bytes: Buffer.byteLength(output),
      featureCount: features.length,
      counts,
    },
    null,
    2,
  ),
);

function toFeature(element) {
  const tags = element.tags ?? {};
  const rawCoordinates = element.geometry
    ?.filter(Boolean)
    .map(({ lon, lat }) => [lon, lat]);
  if (!rawCoordinates || rawCoordinates.length < 2) return null;

  let kind;
  let className;
  let geometryType = "LineString";

  if (tags.highway) {
    kind = "road";
    className = tags.highway.replace(/_link$/, "");
  } else if (tags.waterway) {
    kind = "waterway";
    className = tags.waterway;
  } else if (tags.natural === "water" || tags.landuse === "reservoir") {
    kind = "water";
    className = tags.water ?? tags.natural ?? tags.landuse;
    geometryType = isClosed(rawCoordinates) ? "Polygon" : "LineString";
  } else if (tags.leisure === "park" || tags.leisure === "garden") {
    kind = "park";
    className = tags.leisure;
    geometryType = isClosed(rawCoordinates) ? "Polygon" : "LineString";
  } else {
    return null;
  }

  const tolerance = kind === "road" && isMajorRoad(className) ? 0.000012 : 0.00002;
  let coordinates = simplify(rawCoordinates, tolerance).map(roundCoordinate);

  if (geometryType === "Polygon") {
    if (!sameCoordinate(coordinates[0], coordinates.at(-1))) {
      coordinates.push(coordinates[0]);
    }
    if (coordinates.length < 4) return null;
    coordinates = [coordinates];
  } else if (coordinates.length < 2) {
    return null;
  }

  return {
    type: "Feature",
    id: element.id,
    properties: {
      kind,
      class: className,
      name: tags.name ?? null,
      reference: tags.ref ?? null,
      corridor: kind === "road" && isCorridorFeature(tags),
      bridge: tags.bridge === "yes",
      tunnel: tags.tunnel === "yes",
    },
    geometry: {
      type: geometryType,
      coordinates,
    },
  };
}

function isMajorRoad(className) {
  return ["motorway", "trunk", "primary", "secondary"].includes(className);
}

function isCorridorFeature(tags) {
  const name = (tags.name ?? "")
    .replace(/^(?:Đường|Cầu|Đại lộ)\s+/iu, "")
    .trim();
  return canonicalCorridors.has(name) || /^(?:QL\s?50|50)$/iu.test(tags.ref ?? "");
}

function isClosed(coordinates) {
  return coordinates.length >= 4 && sameCoordinate(coordinates[0], coordinates.at(-1));
}

function sameCoordinate(a, b) {
  return Boolean(a && b && a[0] === b[0] && a[1] === b[1]);
}

function roundCoordinate([longitude, latitude]) {
  return [Number(longitude.toFixed(6)), Number(latitude.toFixed(6))];
}

function simplify(points, tolerance) {
  if (points.length <= 2) return points;

  const first = points[0];
  const last = points.at(-1);
  let maxDistance = 0;
  let splitIndex = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = squaredSegmentDistance(points[index], first, last);
    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }

  if (maxDistance <= tolerance * tolerance) return [first, last];

  const left = simplify(points.slice(0, splitIndex + 1), tolerance);
  const right = simplify(points.slice(splitIndex), tolerance);
  return [...left.slice(0, -1), ...right];
}

function squaredSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;

  if (dx !== 0 || dy !== 0) {
    const ratio =
      ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (ratio > 1) {
      x = end[0];
      y = end[1];
    } else if (ratio > 0) {
      x += dx * ratio;
      y += dy * ratio;
    }
  }

  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

function compareFeatures(a, b) {
  return (
    a.properties.kind.localeCompare(b.properties.kind) ||
    a.properties.class.localeCompare(b.properties.class) ||
    String(a.properties.name).localeCompare(String(b.properties.name), "vi") ||
    a.id - b.id
  );
}
