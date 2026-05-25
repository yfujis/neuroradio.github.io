import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const dataPath = join(root, "data/episodes.json");
const builderPath = join(root, "tools/build-site.mjs");

assert(existsSync(dataPath), "Missing data/episodes.json");
assert(existsSync(builderPath), "Missing tools/build-site.mjs");

const episodes = JSON.parse(readFileSync(dataPath, "utf8"));
assert(Array.isArray(episodes), "data/episodes.json must be an array");
assert(episodes.length >= 5, "Expected at least 5 episodes in data/episodes.json");

const [latest] = episodes;
assert(latest.title && latest.path && latest.summary, "Latest episode needs title, path, and summary");
assert(latest.spotifyEmbedSrc, "Latest episode needs spotifyEmbedSrc");
assert(Array.isArray(latest.showNotes) || latest.showNotesHtml, "Latest episode needs show notes");
assert(Array.isArray(latest.editorialNotes) || latest.editorialNotesHtml, "Latest episode needs editorial notes");

const home = readFileSync(join(root, "index.html"), "utf8");
assert(home.includes(latest.title), "Homepage must show latest episode title from data");
assert(home.includes(`href="${latest.path}"`), "Homepage must link latest title to data path");
assert(home.includes(latest.spotifyEmbedSrc), "Homepage must embed latest Spotify player from data");

for (const episode of episodes) {
  assert(episode.path.startsWith("/"), `Episode path must be root-relative: ${episode.title}`);
  assert(episode.path.endsWith("/"), `Episode path must end with slash: ${episode.title}`);

  const pagePath = join(root, episode.path, "index.html");
  assert(existsSync(pagePath), `Missing generated episode page: ${episode.path}`);

  const html = readFileSync(pagePath, "utf8");
  assert(html.includes(episode.title), `Episode page must show title: ${episode.title}`);
  assert(html.includes(episode.spotifyEmbedSrc), `Episode page must embed Spotify player: ${episode.title}`);
  assert(html.includes('id="show-notes"'), `Episode page must include Show Notes: ${episode.title}`);
  assert(html.includes('id="editorial-notes"'), `Episode page must include Editorial Notes: ${episode.title}`);
}

console.log(`Checked data-driven build workflow for ${episodes.length} episodes.`);
