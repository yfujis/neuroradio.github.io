import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const episodePaths = [
  "/2026/05/12/104-empire-social-state-of-mind/",
  "/2026/04/08/103-real-projections-and-tangential-matters/",
  "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
  "/2025/12/24/101-taco-chronicles/",
  "/2025/11/01/100-everything-in-its-right-place/",
];

const episodesWithEditorialNotes = new Set([
  "/2026/05/12/104-empire-social-state-of-mind/",
  "/2026/04/08/103-real-projections-and-tangential-matters/",
  "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
  "/2025/12/24/101-taco-chronicles/",
  "/2025/11/01/100-everything-in-its-right-place/",
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readLocal(path) {
  return readFileSync(join(root, path), "utf8");
}

const home = readLocal("index.html");

for (const path of episodePaths) {
  const localFile = join(root, path, "index.html");
  assert(existsSync(localFile), `Missing episode page: ${path}index.html`);
  assert(statSync(localFile).isFile(), `Missing episode page: ${path}index.html`);
  assert(home.includes(`href="${path}"`), `Homepage must link to local episode path: ${path}`);

  const html = readFileSync(localFile, "utf8");
  assert(html.includes('lang="ja"'), `Episode page must be Japanese: ${path}`);
  assert(html.includes('href="/"'), `Episode page must link back to site root: ${path}`);
  assert(html.includes('href="/styles.css?v=20260525"'), `Episode page must use root CSS path: ${path}`);
  assert(html.includes("spotify.com"), `Episode page must include Spotify embed: ${path}`);
  assert(html.includes('id="show-notes"'), `Episode page must include full Show Notes: ${path}`);
  if (episodesWithEditorialNotes.has(path)) {
    assert(html.includes('id="editorial-notes"'), `Episode page must include Editorial Notes: ${path}`);
  }
  assert(!html.includes("neuroradio.tokyo/2026") && !html.includes("neuroradio.tokyo/2025"), `Episode page should not link to old local episode URL externally: ${path}`);
}

console.log(`Checked ${episodePaths.length} local episode pages.`);
