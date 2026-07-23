import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the TOEIC vocabulary app shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Vocabulary Journal｜多益單字回憶錄<\/title>/i);
  assert.match(html, /正在準備你的單字卡/);
  assert.match(html, /ca-pub-8138757816007679/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("uses the complete, unique 1–1737 Excel vocabulary set", async () => {
  const source = await readFile(new URL("../app/pdfWords.ts", import.meta.url), "utf8");
  const records = source
    .split("\n")
    .filter((line) => line.startsWith("  {") && line.trimEnd().endsWith("},"))
    .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

  assert.equal(records.length, 1737);
  assert.equal(records[0].word, "accept");
  assert.equal(records.at(-1).word, "yield");
  assert.equal(new Set(records.map(({ word }) => word.toLocaleLowerCase("en-US"))).size, 1737);
  assert.ok(records.every(({ word, level, pos, meaning, example, exampleZh }) =>
    word && ["基礎", "中階", "進階"].includes(level) && pos && meaning && example && exampleZh));
});
