"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  Popup as MapLibrePopup,
  StyleSpecification,
} from "maplibre-gl";

export type Branch = {
  id: string;
  number: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  connection: string;
  coordinates: [number, number];
  directionsUrl: string;
  approximate?: boolean;
};

const directionsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const BRANCHES: readonly Branch[] = [
  {
    id: "hoi-so",
    number: 1,
    name: "H\u1ed9i s\u1edf",
    type: "H\u1ed8I S\u1ede",
    address:
      "925 - 925 (ABCD), T\u1ea1 Quang B\u1eedu, Ph\u01b0\u1eddng B\u00ecnh \u0110\u00f4ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837515939",
    connection: "T\u1ea1 Quang B\u1eedu \u00b7 QL50",
    coordinates: [106.6585755, 10.7339522],
    directionsUrl: directionsUrl(
      "925 T\u1ea1 Quang B\u1eedu, Ph\u01b0\u1eddng B\u00ecnh \u0110\u00f4ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "nam-hoa",
    number: 2,
    name: "Chi nh\u00e1nh Nam Hoa",
    type: "CHI NH\u00c1NH",
    address: "241 H\u1eadu Giang, Ph\u01b0\u1eddng B\u00ecnh T\u00e2y, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02839607865",
    connection: "H\u1eadu Giang \u00b7 Minh Ph\u1ee5ng",
    coordinates: [106.6439967, 10.7495461],
    directionsUrl: directionsUrl(
      "241 H\u1eadu Giang, Ph\u01b0\u1eddng B\u00ecnh T\u00e2y, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "binh-tay",
    number: 3,
    name: "PGD B\u00ecnh T\u00e2y",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address: "61 Ch\u1ee3 L\u1edbn, Ph\u01b0\u1eddng B\u00ecnh Ph\u00fa, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837554673",
    connection: "Ch\u1ee3 L\u1edbn \u00b7 H\u1eadu Giang",
    coordinates: [106.6326919, 10.7458739],
    directionsUrl: directionsUrl(
      "61 Ch\u1ee3 L\u1edbn, Ph\u01b0\u1eddng B\u00ecnh Ph\u00fa, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "chanh-hung",
    number: 4,
    name: "PGD Ch\u00e1nh H\u01b0ng",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address:
      "329 Ph\u1ea1m H\u00f9ng, KDC Him Lam, \u1ea4p 4A, X\u00e3 B\u00ecnh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02837583488",
    connection: "Ph\u1ea1m H\u00f9ng \u00b7 Nguy\u1ec5n V\u0103n Linh",
    coordinates: [106.6729081, 10.7350739],
    directionsUrl: directionsUrl(
      "329 Ph\u1ea1m H\u00f9ng, X\u00e3 B\u00ecnh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
  },
  {
    id: "duong-ba-trac",
    number: 5,
    name: "PGD D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c",
    type: "PH\u00d2NG GIAO D\u1ecaCH",
    address: "124 D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c, Ph\u01b0\u1eddng Ch\u00e1nh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    phone: "02839830317",
    connection: "D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c \u00b7 C\u1ea7u Nguy\u1ec5n V\u0103n C\u1eeb",
    coordinates: [106.6884174, 10.7480873],
    directionsUrl: directionsUrl(
      "124 D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c, Ph\u01b0\u1eddng Ch\u00e1nh H\u01b0ng, TP. H\u1ed3 Ch\u00ed Minh",
    ),
    approximate: true,
  },
];

type BranchMapProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

type MarkerEntry = {
  marker: MapLibreMarker;
  element: HTMLButtonElement;
  handleClick: (event: MouseEvent) => void;
};

const ALL_BRANCH_BOUNDS: [[number, number], [number, number]] = [
  [
    Math.min(...BRANCHES.map((branch) => branch.coordinates[0])),
    Math.min(...BRANCHES.map((branch) => branch.coordinates[1])),
  ],
  [
    Math.max(...BRANCHES.map((branch) => branch.coordinates[0])),
    Math.max(...BRANCHES.map((branch) => branch.coordinates[1])),
  ],
];

const LOCAL_MAP_BOUNDS: [[number, number], [number, number]] = [
  [106.62, 10.72],
  [106.7, 10.762],
];

const LOCAL_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    network: {
      type: "geojson",
      data: "/data/branch-network.geojson",
      attribution:
        '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">\u00a9 OpenStreetMap contributors</a>',
      maxzoom: 17,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#f2eee6" },
    },
    {
      id: "parks",
      type: "fill",
      source: "network",
      filter: ["==", ["get", "kind"], "park"],
      paint: {
        "fill-color": "#dbe4d5",
        "fill-opacity": 0.78,
        "fill-outline-color": "#cbd7c5",
      },
    },
    {
      id: "water",
      type: "fill",
      source: "network",
      filter: ["==", ["get", "kind"], "water"],
      paint: {
        "fill-color": "#c8dde3",
        "fill-opacity": 0.9,
        "fill-outline-color": "#b8d1d8",
      },
    },
    {
      id: "waterways",
      type: "line",
      source: "network",
      filter: ["==", ["get", "kind"], "waterway"],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#afd0d9",
        "line-opacity": 0.92,
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.7, 16, 3.4],
      },
    },
    {
      id: "minor-road-casing",
      type: "line",
      source: "network",
      minzoom: 13,
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        [
          "in",
          ["get", "class"],
          ["literal", ["residential", "service", "unclassified", "cycleway", "pedestrian"]],
        ],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#d5cfc5",
        "line-width": ["interpolate", ["linear"], ["zoom"], 13, 1.4, 17, 7],
      },
    },
    {
      id: "minor-roads",
      type: "line",
      source: "network",
      minzoom: 13,
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        [
          "in",
          ["get", "class"],
          ["literal", ["residential", "service", "unclassified", "cycleway", "pedestrian"]],
        ],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#fffdf8",
        "line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.8, 17, 5.2],
      },
    },
    {
      id: "tertiary-road-casing",
      type: "line",
      source: "network",
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["==", ["get", "class"], "tertiary"],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#cbc3b8",
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1, 16, 9.5],
      },
    },
    {
      id: "tertiary-roads",
      type: "line",
      source: "network",
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["==", ["get", "class"], "tertiary"],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#fcf8ee",
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.55, 16, 7.3],
      },
    },
    {
      id: "major-road-casing",
      type: "line",
      source: "network",
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#bcb1a6",
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.8, 16, 13.5],
      },
    },
    {
      id: "major-roads",
      type: "line",
      source: "network",
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary"]]],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": [
          "match",
          ["get", "class"],
          "motorway",
          "#e8c7b8",
          "trunk",
          "#ebcfb5",
          "primary",
          "#f1dcc0",
          "#f7e9d2",
        ],
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.15, 16, 10.8],
      },
    },
    {
      id: "major-road-labels",
      type: "symbol",
      source: "network",
      minzoom: 11.8,
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary", "secondary", "tertiary"]]],
        ["!=", ["get", "corridor"], true],
      ],
      layout: {
        "symbol-placement": "line",
        "symbol-spacing": 420,
        "text-field": ["coalesce", ["get", "name"], ["get", "reference"]],
        "text-font": ["Arial", "Noto Sans", "sans-serif"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 12, 9, 16, 12],
        "text-max-angle": 35,
      },
      paint: {
        "text-color": "#625e58",
        "text-halo-color": "#f8f4ec",
        "text-halo-width": 1.4,
      },
    },
    {
      id: "corridor-labels",
      type: "symbol",
      source: "network",
      minzoom: 12,
      filter: [
        "all",
        ["==", ["get", "kind"], "road"],
        ["==", ["get", "corridor"], true],
      ],
      layout: {
        "symbol-placement": "line",
        "symbol-spacing": 360,
        "text-field": ["coalesce", ["get", "name"], ["get", "reference"]],
        "text-font": ["Arial", "Noto Sans", "sans-serif"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 12, 9.5, 16, 12.5],
        "text-max-angle": 35,
      },
      paint: {
        "text-color": "#6d2638",
        "text-halo-color": "#fffaf1",
        "text-halo-width": 1.6,
      },
    },
  ],
};

function formatPhone(phone: string) {
  return phone.replace(/^(028)(\d{4})(\d{4})$/, "$1 $2 $3");
}

function createPopupContent(branch: Branch) {
  const content = document.createElement("div");
  content.className = "branch-popup";

  const type = document.createElement("small");
  type.textContent = `${branch.type} \u00b7 ${String(branch.number).padStart(2, "0")}`;

  const title = document.createElement("strong");
  title.textContent = branch.name;

  const address = document.createElement("span");
  address.textContent = branch.address;

  const actions = document.createElement("div");
  actions.className = "branch-popup-actions";

  const phone = document.createElement("a");
  phone.href = `tel:+84${branch.phone.slice(1)}`;
  phone.textContent = formatPhone(branch.phone);
  phone.setAttribute("aria-label", `G\u1ecdi ${branch.name}: ${formatPhone(branch.phone)}`);

  const directions = document.createElement("a");
  directions.href = branch.directionsUrl;
  directions.target = "_blank";
  directions.rel = "noopener noreferrer";
  directions.textContent = "Ch\u1ec9 \u0111\u01b0\u1eddng \u2197";
  directions.setAttribute(
    "aria-label",
    `Ch\u1ec9 \u0111\u01b0\u1eddng \u0111\u1ebfn ${branch.name} - m\u1edf trong th\u1ebb m\u1edbi`,
  );

  actions.append(phone, directions);
  content.append(type, title, address, actions);
  return content;
}

export default function BranchMap({ selectedId, onSelect }: BranchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<MapLibrePopup | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    const mapContainer = container;

    const markers = markersRef.current;
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let handleMapError:
      | ((event: { error?: { message?: string } }) => void)
      | null = null;

    async function initialiseMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled) return;

        setMapError(false);

        map = new maplibregl.Map({
          container: mapContainer,
          style: LOCAL_MAP_STYLE,
          center: [106.6607, 10.7433],
          zoom: 12.3,
          minZoom: 11.5,
          maxZoom: 17,
          maxBounds: LOCAL_MAP_BOUNDS,
          renderWorldCopies: false,
        });
        mapRef.current = map;

        handleMapError = (event) => {
          const message = event.error?.message ?? "";
          if (!cancelled && /branch-network\.geojson/i.test(message)) {
            setMapError(true);
          }
        };
        map.on("error", handleMapError);

        popupRef.current = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: "310px",
          offset: 24,
        });

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );

        BRANCHES.forEach((branch) => {
          const element = document.createElement("button");
          const number = document.createElement("span");
          element.type = "button";
          element.className = "branch-marker";
          number.textContent = String(branch.number).padStart(2, "0");
          element.append(number);
          element.title = branch.name;
          element.setAttribute(
            "aria-label",
            `Ch\u1ecdn \u0111i\u1ec3m giao d\u1ecbch ${branch.number}: ${branch.name}`,
          );
          element.setAttribute("aria-pressed", "false");

          const handleClick = (event: MouseEvent) => {
            event.stopPropagation();
            onSelectRef.current(branch.id);
          };
          element.addEventListener("click", handleClick);

          const marker = new maplibregl.Marker({ element, anchor: "center" })
            .setLngLat(branch.coordinates)
            .addTo(map as MapLibreMap);

          markers.set(branch.id, { marker, element, handleClick });
        });

        map.once("load", () => {
          if (!cancelled) setIsReady(true);
        });

        resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(mapContainer);
      } catch {
        if (!cancelled) setMapError(true);
      }
    }

    void initialiseMap();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      markers.forEach(({ marker, element, handleClick }) => {
        element.removeEventListener("click", handleClick);
        marker.remove();
      });
      markers.clear();
      popupRef.current?.remove();
      popupRef.current = null;
      if (handleMapError) map?.off("error", handleMapError);
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    const map = mapRef.current;
    const branch = BRANCHES.find((item) => item.id === selectedId);
    const compactViewport = window.matchMedia("(max-width: 900px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cameraDuration = prefersReducedMotion ? 0 : 900;

    markersRef.current.forEach(({ element }, branchId) => {
      const active = branchId === selectedId;
      element.classList.toggle("is-active", active);
      element.setAttribute("aria-pressed", String(active));
    });

    popupRef.current?.remove();

    if (!branch) {
      map.fitBounds(ALL_BRANCH_BOUNDS, {
        padding: compactViewport
          ? { top: 80, right: 28, bottom: 120, left: 28 }
          : { top: 135, right: 100, bottom: 105, left: 100 },
        maxZoom: 13.5,
        duration: cameraDuration,
        essential: false,
      });
      return;
    }

    const selectionOffset: [number, number] = compactViewport
      ? [0, -64]
      : [0, 0];

    map.flyTo({
      center: branch.coordinates,
      zoom: compactViewport ? 15.2 : 15.8,
      offset: selectionOffset,
      duration: cameraDuration,
      essential: false,
    });

    if (!compactViewport) {
      popupRef.current
        ?.setLngLat(branch.coordinates)
        .setDOMContent(createPopupContent(branch))
        .addTo(map);
    }
  }, [isReady, selectedId]);

  return (
    <div className="map-shell">
      <div
        ref={mapContainerRef}
        className="map-canvas"
        role="region"
        aria-label={"B\u1ea3n \u0111\u1ed3 v\u1ecb tr\u00ed n\u0103m \u0111i\u1ec3m giao d\u1ecbch Agribank"}
      />

      {mapError && (
        <div className="map-error" role="alert">
          <strong>{"Kh\u00f4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u b\u1ea3n \u0111\u1ed3"}</strong>
          <small>{"Vui l\u00f2ng t\u1ea3i l\u1ea1i trang ho\u1eb7c li\u00ean h\u1ec7 qu\u1ea3n tr\u1ecb n\u1ebfu l\u1ed7i ti\u1ebfp di\u1ec5n."}</small>
        </div>
      )}

      <div
        className="map-actions"
        role="group"
        aria-label={"\u0110i\u1ec1u khi\u1ec3n b\u1ea3n \u0111\u1ed3"}
      >
        <button
          type="button"
          className="map-reset-button"
          aria-pressed={selectedId === "all"}
          onClick={() => onSelect("all")}
        >
          {"Xem to\u00e0n b\u1ed9"}
        </button>
      </div>
    </div>
  );
}
