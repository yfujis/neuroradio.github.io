import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const episodes = [
  {
    number: "104",
    date: "2026-05-12",
    path: "/2026/05/12/104-empire-social-state-of-mind/",
    json: "/tmp/neuroradio-104.json",
    previous: "/2026/04/08/103-real-projections-and-tangential-matters/",
  },
  {
    number: "103",
    date: "2026-04-08",
    path: "/2026/04/08/103-real-projections-and-tangential-matters/",
    json: "/tmp/neuroradio-103.json",
    next: "/2026/05/12/104-empire-social-state-of-mind/",
    previous: "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
  },
  {
    number: "102",
    date: "2025-12-31",
    path: "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
    json: "/tmp/neuroradio-102.json",
    next: "/2026/04/08/103-real-projections-and-tangential-matters/",
    previous: "/2025/12/24/101-taco-chronicles/",
  },
  {
    number: "101",
    date: "2025-12-24",
    path: "/2025/12/24/101-taco-chronicles/",
    json: "/tmp/neuroradio-101.json",
    next: "/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/",
    previous: "/2025/11/01/100-everything-in-its-right-place/",
  },
  {
    number: "100",
    date: "2025-11-01",
    path: "/2025/11/01/100-everything-in-its-right-place/",
    json: "/tmp/neuroradio-100.json",
    next: "/2025/12/24/101-taco-chronicles/",
  },
];

function decodeEntities(value) {
  return value
    .replaceAll("&#8217;", "'")
    .replaceAll("&#8220;", '"')
    .replaceAll("&#8221;", '"')
    .replaceAll("&#038;", "&")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function extractSummary(content) {
  const match = content.match(/<p class="wp-block-paragraph">([\s\S]*?)<\/p>/);
  return match ? decodeEntities(match[1]) : "";
}

function extractSpotifyEmbed(content) {
  const match = content.match(/<iframe[^>]+src="([^"]*(?:open|creators)\.spotify\.com[^"]*)"[^>]*><\/iframe>/);
  if (!match) {
    return "";
  }

  const src = match[1].replaceAll("&#038;", "&amp;");
  return `<div class="spotify-embed">
        <iframe src="${src}" width="100%" height="152" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify episode player"></iframe>
      </div>`;
}

function extractNotes(content) {
  const afterMore = content.includes("<!--more-->") ? content.split("<!--more-->")[1] : content;
  return afterMore
    .replaceAll(/href="https:\/\/neuroradio\.tokyo([^"]*)"/g, 'href="$1"')
    .replaceAll(/href="http:\/\/neuroradio\.tokyo([^"]*)"/g, 'href="$1"')
    .replaceAll(/ class="wp-block-[^"]*"/g, "")
    .replaceAll(/ class="size-[^"]*"/g, "")
    .replaceAll(/ class="wp-image-[^"]*"/g, "")
    .replaceAll(/ loading="lazy"/g, "")
    .replaceAll(/ decoding="async"/g, "")
    .replaceAll(/ sizes="[^"]*"/g, "")
    .replaceAll(/ srcset="[^"]*"/g, "")
    .replaceAll(/ width="[^"]*"/g, "")
    .replaceAll(/ height="[^"]*"/g, "")
    .replaceAll("<p>Show Notes:</p>", '<h2 id="show-notes">Show Notes</h2>')
    .replaceAll("<p>Editorial Notes:</p>", '<h2 id="editorial-notes">Editorial Notes</h2>')
    .replaceAll(/<p>\s*<\/p>/g, "");
}

function navLinks(episode) {
  const links = [];
  if (episode.next) links.push(`<a href="${episode.next}">次のエピソード</a>`);
  links.push('<a href="/">トップへ</a>');
  if (episode.previous) links.push(`<a href="${episode.previous}">前のエピソード</a>`);
  return links.join("\n        ");
}

function pageTemplate({ episode, title, summary, notes }) {
  const plainTitle = decodeEntities(title);
  const description = summary.replaceAll('"', "&quot;");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${plainTitle} | NeuroRadio</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${plainTitle} | NeuroRadio">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="/assets/neuroradio-cover.svg">
  <link rel="stylesheet" href="/styles.css?v=20260525">
</head>
<body>
  <a class="skip-link" href="#main">本文へスキップ</a>
  <header class="site-header">
    <nav class="nav" aria-label="メインナビゲーション">
      <a class="brand" href="/" aria-label="NeuroRadio ホーム">
        <span class="brand-main">NeuroRadio</span>
        <span class="brand-sub">Podcast by neuroscientists</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-label">Menu</span>
      </button>
      <div class="nav-links" id="nav-links">
        <a href="/#latest">最新回</a>
        <a href="/#about">About</a>
        <a href="/#episodes">エピソード</a>
        <a href="/#topics">トピック</a>
        <a class="nav-cta" href="/#subscribe">購読</a>
      </div>
    </nav>
  </header>

  <main id="main" class="episode-page">
    <article class="episode-detail">
      <p class="eyebrow">Podcast</p>
      <h1>${plainTitle}</h1>
      <p class="episode-date">${episode.date}</p>
      <p class="hero-lede">${summary}</p>
      ${episode.spotifyEmbed || `<div class="episode-player-card">
        <img src="/assets/neuroradio-cover.svg" alt="NeuroRadioのカバーアート">
        <div>
          <p class="eyebrow">Listen</p>
          <h2>NeuroRadio #${episode.number}</h2>
          <p>プレイヤーは本番移行時に埋め込み予定です。</p>
          <a class="button primary" href="/#subscribe">SUBSCRIBE</a>
        </div>
      </div>`}
      <section class="episode-content" aria-label="${plainTitle} のShow NotesとEditorial Notes">
${notes.trim()}
      </section>
      <nav class="episode-nav" aria-label="エピソードナビゲーション">
        ${navLinks(episode)}
      </nav>
    </article>
  </main>

  <script src="/script.js?v=20260525"></script>
</body>
</html>
`;
}

for (const episode of episodes) {
  const [post] = JSON.parse(readFileSync(episode.json, "utf8"));
  if (!post) {
    throw new Error(`Missing WordPress post data: ${episode.json}`);
  }

  const title = post.title.rendered;
  const content = post.content.rendered;
  const summary = extractSummary(content);
  const notes = extractNotes(content);
  episode.spotifyEmbed = extractSpotifyEmbed(content);
  const target = join(root, episode.path, "index.html");

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, pageTemplate({ episode, title, summary, notes }));
}

console.log(`Imported full notes for ${episodes.length} episodes.`);
