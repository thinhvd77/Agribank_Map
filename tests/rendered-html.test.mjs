import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the branch network page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="vi"/i);
  assert.match(html, /M\u1ea1ng l\u01b0\u1edbi \u0111i\u1ec3m giao d\u1ecbch/i);
  assert.match(html, /H\u1ed9i s\u1edf/);
  assert.match(html, /Chi nh\u00e1nh Nam Hoa/);
  assert.match(html, /PGD B\u00ecnh T\u00e2y/);
  assert.match(html, /PGD Ch\u00e1nh H\u01b0ng/);
  assert.match(html, /PGD D\u01b0\u01a1ng B\u00e1 Tr\u1ea1c/);
  assert.match(
    html,
    /https:\/\/agribank-chi-nhanh-8-map\.vodangthinh4\.chatgpt\.site\/og\.png/,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("removes starter assets and keeps product metadata", async () => {
  const [page, layout, branchMap, globals, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/BranchMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.match(branchMap, /02837515939/);
  assert.match(branchMap, /02839830317/);
  assert.match(branchMap, /anchor: "center"/);
  assert.doesNotMatch(branchMap, /anchor: "bottom"/);
  assert.match(globals, /\.branch-marker\s*\{\s*position: absolute;/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(access(new URL("app/_sites-preview/", projectRoot)));
});
