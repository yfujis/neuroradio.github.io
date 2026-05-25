import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const draftPath = process.argv[2];

function usage() {
  console.error("Usage: node tools/add-episode.mjs path/to/new-episode.json");
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/^#\d+\s*/, "")
    .replaceAll(/&amp;|&/g, "and")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function pathFromEpisode(episode) {
  const [year, month, day] = episode.date.split("-");
  return `/${year}/${month}/${day}/${episode.number}-${slugify(episode.title)}/`;
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

if (!draftPath) {
  usage();
}

const draft = JSON.parse(readFileSync(draftPath, "utf8"));
const required = ["number", "title", "date", "summary", "spotifyEmbedSrc"];

for (const key of required) {
  assert(draft[key], `Draft is missing required field: ${key}`);
}

assert(Array.isArray(draft.showNotes) || draft.showNotesHtml, "Draft needs showNotes array or showNotesHtml");
assert(Array.isArray(draft.editorialNotes) || draft.editorialNotesHtml, "Draft needs editorialNotes array or editorialNotesHtml");

const dataPath = join(root, "data/episodes.json");
const episodes = JSON.parse(readFileSync(dataPath, "utf8"));
const episode = {
  topics: [],
  ...draft,
  path: draft.path || pathFromEpisode(draft),
};

assert(!episodes.some((existing) => existing.path === episode.path), `Episode path already exists: ${episode.path}`);
assert(!episodes.some((existing) => existing.number === episode.number), `Episode number already exists: ${episode.number}`);

episodes.unshift(episode);
writeFileSync(dataPath, `${JSON.stringify(episodes, null, 2)}\n`);

run("node", ["tools/build-site.mjs"]);
run("node", ["tools/check-build-workflow.mjs"]);
run("node", ["tools/check-static-site.mjs"]);

console.log(`Added ${episode.title} at ${episode.path}`);
