import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("uses a standard self-hosted Next.js setup", async () => {
  const [packageText, layout, readme, refreshScript] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../scripts/refresh-local-map.mjs", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.equal(packageJson.name, "agribank-branch-map");
  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.ok(packageJson.dependencies.next);
  assert.ok(packageJson.dependencies["maplibre-gl"]);

  const projectConfiguration = `${packageText}\n${layout}\n${readme}\n${refreshScript}`;
  assert.doesNotMatch(
    projectConfiguration,
    /vinext|wrangler|cloudflare:workers|chatgpt\.site|\.openai\/hosting|oai-authenticated/i,
  );
  assert.match(layout, /process\.env\.SITE_URL \?\? "http:\/\/localhost:3000"/);
  assert.match(refreshScript, /process\.env\.OVERPASS_USER_AGENT/);

  await access(new URL("../.next/BUILD_ID", import.meta.url));
  await access(new URL("../next.config.ts", import.meta.url));
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
  await assert.rejects(access(new URL("../vite.config.ts", import.meta.url)));
  await assert.rejects(access(new URL("../worker/index.ts", import.meta.url)));
  await assert.rejects(access(new URL("../app/chatgpt-auth.ts", import.meta.url)));
});

test("keeps the branch map and local GeoJSON data", async () => {
  const [page, layout, branchMap, globals, localMap] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/BranchMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/data/branch-network.geojson", import.meta.url), "utf8"),
  ]);

  assert.match(
    `${page}\n${layout}\n${branchMap}`,
    /Agribank Chi nh\\u00e1nh B\\u1eafc Th\\u00e0nh ph\\u1ed1 H\\u1ed3 Ch\\u00ed Minh/,
  );
  assert.match(branchMap, /02837515939/);
  assert.match(branchMap, /02839830317/);
  assert.match(branchMap, /anchor: "bottom"/);
  assert.match(branchMap, /compactViewport\s*\? \[0, 72\]\s*:\s*\[0, 48\]/);
  assert.match(branchMap, /branch-marker-pin/);
  assert.doesNotMatch(`${branchMap}\n${globals}`, /branch-marker-label/);
  assert.match(branchMap, /\.setDOMContent\(createPopupContent\(branch\)\)/);
  assert.doesNotMatch(
    branchMap,
    /if\s*\(\s*!compactViewport\s*\)\s*\{\s*popupRef\.current/,
  );
  assert.match(branchMap, /\/data\/branch-network\.geojson/);
  assert.match(branchMap, /OpenStreetMap contributors/);
  assert.doesNotMatch(branchMap, /tiles\.openfreemap\.org|tile\.openstreetmap\.org/);
  assert.match(globals, /\.branch-marker\.is-head-office/);

  const network = JSON.parse(localMap);
  assert.equal(network.type, "FeatureCollection");
  assert.ok(network.features.length > 1_000);
  assert.deepEqual(network.metadata.bounds, [106.62, 10.72, 106.7, 10.762]);
  assert.ok(network.features.some((feature) => feature.properties.kind === "road"));
  assert.ok(network.features.some((feature) => feature.properties.kind === "waterway"));

  const branchCoordinates = [
    [106.6585755, 10.7339522],
    [106.6439967, 10.7495461],
    [106.6326919, 10.7458739],
    [106.6729081, 10.7350739],
    [106.6884174, 10.7480873],
  ];
  const [west, south, east, north] = network.metadata.bounds;
  for (const [longitude, latitude] of branchCoordinates) {
    assert.ok(longitude >= west && longitude <= east);
    assert.ok(latitude >= south && latitude <= north);
  }

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/data/branch-network.geojson", import.meta.url));
});
