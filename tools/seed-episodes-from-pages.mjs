import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const seeds = [
  {
    number: "104",
    path: "/2026/05/12/104-empire-social-state-of-mind/",
    topics: ["社会行動", "研究生活", "ゲスト回"],
  },
  {
    number: "103",
    path: "/2026/04/08/103-real-projections-and-tangential-matters/",
    topics: ["学会", "研究生活"],
  },
  {
    number: "102",
    path: "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
    topics: ["記憶", "論文解説", "留学", "ゲスト回"],
  },
  {
    number: "101",
    path: "/2025/12/24/101-taco-chronicles/",
    topics: ["学会", "研究生活"],
  },
  {
    number: "100",
    path: "/2025/11/01/100-everything-in-its-right-place/",
    topics: ["PI・キャリア", "研究生活", "ゲスト回"],
  },
];

function matchOne(html, pattern, label) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return match[1].trim();
}

function splitNotes(content) {
  const [showNotesPart, editorialPart = ""] = content.split(/<h2 id="editorial-notes">Editorial Notes<\/h2>/);
  return {
    showNotesHtml: showNotesPart.replace(/^\s*<h2 id="show-notes">Show Notes<\/h2>/, "").trim(),
    editorialNotesHtml: editorialPart.trim(),
  };
}

const episodes = seeds.map((seed) => {
  const html = readFileSync(join(root, seed.path, "index.html"), "utf8");
  const title = matchOne(html, /<h1>([\s\S]*?)<\/h1>/, `${seed.path} title`).replaceAll(/\s+/g, " ");
  const date = matchOne(html, /<p class="episode-date">([\s\S]*?)<\/p>/, `${seed.path} date`);
  const summary = matchOne(html, /<p class="hero-lede">([\s\S]*?)<\/p>/, `${seed.path} summary`);
  const spotifyEmbedSrc = matchOne(html, /<iframe src="([^"]*spotify\.com[^"]*)"/, `${seed.path} Spotify embed`);
  const content = matchOne(
    html,
    /<section class="episode-content"[^>]*>\s*([\s\S]*?)\s*<\/section>/,
    `${seed.path} episode content`,
  );

  return {
    number: seed.number,
    title,
    date,
    path: seed.path,
    summary,
    spotifyEmbedSrc,
    topics: seed.topics,
    ...splitNotes(content),
  };
});

mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(join(root, "data/episodes.json"), `${JSON.stringify(episodes, null, 2)}\n`);
console.log(`Seeded ${episodes.length} episodes to data/episodes.json`);
