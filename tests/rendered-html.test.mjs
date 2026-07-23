import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build contains the TOEIC shell and secure Google sign-in routes", async () => {
  const [layout, page, authRoute, progressRoute, worker] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/progress/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/index.js", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /Vocabulary Journal｜多益單字回憶錄/);
  assert.match(layout, /accounts\.google\.com\/gsi\/client/);
  assert.match(layout, /ca-pub-8138757816007679/);
  assert.match(page, /登入即可備份江湖修為，換手機也不怕心法盡失/);
  assert.match(authRoute, /verifyGoogleCredential/);
  assert.match(progressRoute, /getSessionUser/);
  assert.match(worker, /api\/auth\/google/);
  assert.doesNotMatch(layout + page, /Your site is taking shape|codex-preview/);
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
