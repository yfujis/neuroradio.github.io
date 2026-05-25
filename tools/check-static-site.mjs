import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readLocal(path) {
  return readFileSync(join(root, path), "utf8");
}

const home = readLocal("index.html");
const episodes = JSON.parse(readLocal("data/episodes.json"));
const homepageEpisodes = new Set(episodes.slice(0, 5).map((episode) => episode.path));

for (const episode of episodes) {
  const { path } = episode;
  const localFile = join(root, path, "index.html");
  assert(existsSync(localFile), `Missing episode page: ${path}index.html`);
  assert(statSync(localFile).isFile(), `Missing episode page: ${path}index.html`);
  if (homepageEpisodes.has(path)) {
    assert(home.includes(`href="${path}"`), `Homepage must link to recent episode path: ${path}`);
  }

  const html = readFileSync(localFile, "utf8");
  assert(html.includes('lang="ja"'), `Episode page must be Japanese: ${path}`);
  assert(html.includes('href="/"'), `Episode page must link back to site root: ${path}`);
  assert(html.includes('href="/styles.css?v=20260525"'), `Episode page must use root CSS path: ${path}`);
  assert(html.includes("spotify.com"), `Episode page must include Spotify embed: ${path}`);
  assert(html.includes('id="show-notes"'), `Episode page must include full Show Notes: ${path}`);
  assert(html.includes('id="editorial-notes"'), `Episode page must include Editorial Notes: ${path}`);
  assert(!html.includes("neuroradio.tokyo/2026") && !html.includes("neuroradio.tokyo/2025"), `Episode page should not link to old local episode URL externally: ${path}`);
}

console.log(`Checked ${episodes.length} local episode pages.`);
