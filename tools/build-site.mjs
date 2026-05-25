import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const episodes = JSON.parse(readFileSync(join(root, "data/episodes.json"), "utf8"));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function plainText(value) {
  return String(value).replaceAll(/<[^>]+>/g, "").replaceAll(/\s+/g, " ").trim();
}

function noteItemsToHtml(items) {
  if (!items || items.length === 0) {
    return "<ul><li>準備中です。</li></ul>";
  }

  return `<ul>
${items.map((item) => `<li>${item}</li>`).join("\n")}
</ul>`;
}

function showNotesHtml(episode) {
  return episode.showNotesHtml || noteItemsToHtml(episode.showNotes);
}

function editorialNotesHtml(episode) {
  return episode.editorialNotesHtml || noteItemsToHtml(episode.editorialNotes);
}

function spotifyEmbed(src) {
  return `<div class="spotify-embed">
        <iframe src="${src}" width="100%" height="152" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify episode player"></iframe>
      </div>`;
}

function header({ rootPath = "" } = {}) {
  const prefix = rootPath || "";
  return `<header class="site-header">
    <nav class="nav" aria-label="メインナビゲーション">
      <a class="brand" href="${prefix}/" aria-label="NeuroRadio ホーム">
        <span class="brand-main">NeuroRadio</span>
        <span class="brand-sub">Podcast by neuroscientists</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-label">Menu</span>
      </button>
      <div class="nav-links" id="nav-links">
        <a href="${prefix}/#latest">最新回</a>
        <a href="${prefix}/#about">About</a>
        <a href="${prefix}/#episodes">エピソード</a>
        <a href="${prefix}/#topics">トピック</a>
        <a class="nav-cta" href="${prefix}/#subscribe">購読</a>
      </div>
    </nav>
  </header>`;
}

function episodeTags(episode) {
  return episode.topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("");
}

function episodeCard(episode) {
  return `<article class="episode-card" data-topics="${escapeHtml(episode.topics.join(" "))}">
          <p class="episode-date">${episode.date}</p>
          <h3>${episode.title}</h3>
          <p>${episode.summary}</p>
          <div class="tags">${episodeTags(episode)}</div>
          <a href="${episode.path}">詳細を見る</a>
        </article>`;
}

function topicButtons() {
  const topics = ["社会行動", "記憶", "学会", "留学", "PI・キャリア", "研究生活"];
  return `<button type="button" class="topic-filter active" data-filter="all">すべて</button>
        ${topics.map((topic) => {
          const filter = topic === "PI・キャリア" ? "PI" : topic;
          return `<button type="button" class="topic-filter" data-filter="${filter}">${topic}</button>`;
        }).join("\n        ")}`;
}

function renderHome() {
  const [latest] = episodes;
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NeuroRadio | 神経科学者によるPodcast</title>
  <meta name="description" content="NeuroRadioは神経科学者が神経科学の新着論文、研究業界、海外での研究生活を語る日本語Podcastです。">
  <meta property="og:title" content="NeuroRadio">
  <meta property="og:description" content="神経科学者による日本語Podcast。最新回、エピソード、購読リンクをまとめています。">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/neuroradio-cover.svg">
  <link rel="stylesheet" href="styles.css?v=20260525">
</head>
<body>
  <a class="skip-link" href="#main">本文へスキップ</a>

  ${header()}

  <main id="main">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">神経科学者によるPodcast</p>
        <h1 id="hero-title"><span>研究者の会話を、</span><span>そのまま聴く。</span></h1>
        <p class="hero-lede">NeuroRadioは、神経科学の新着論文、研究業界、海外での研究生活を語る日本語ポッドキャストです。</p>
        <div class="hero-actions" aria-label="主要アクション">
          <a class="button primary" href="${latest.path}">最新回を聴く</a>
          <a class="button secondary" href="#subscribe">SUBSCRIBE</a>
        </div>
      </div>
      <article class="latest-card" id="latest" aria-labelledby="latest-title">
        <div class="latest-art">
          <img src="assets/neuroradio-cover.svg" alt="NeuroRadioのカバーアート">
        </div>
        <div class="latest-body">
          <p class="eyebrow">最新回</p>
          <h2 id="latest-title"><a href="${latest.path}">${latest.title}</a></h2>
          <p>${latest.summary}</p>
          ${spotifyEmbed(latest.spotifyEmbedSrc)}
        </div>
      </article>
    </section>

    <section class="subscribe-section" id="subscribe" aria-labelledby="subscribe-title">
      <div>
        <p class="eyebrow">Subscribe</p>
        <h2 id="subscribe-title">好きなアプリで購読する</h2>
        <p>各種ポッドキャストクライアントで購読すると、新しいエピソードを自動で受け取れます。</p>
      </div>
      <div class="platform-grid">
        <a class="platform" href="https://podcasts.apple.com/jp/podcast/neuroradio/id1556937028">Apple Podcasts</a>
        <a class="platform" href="https://open.spotify.com/show/2EA3S51dcQ0pRUTCX2ivsF">Spotify</a>
        <span class="platform disabled" aria-disabled="true">YouTube Music</span>
        <a class="platform" href="https://anchor.fm/s/4ddf5488/podcast/rss">RSS</a>
      </div>
    </section>

    <section class="about-section" id="about" aria-labelledby="about-title">
      <div class="section-heading">
        <p class="eyebrow">About</p>
        <h2 id="about-title">NeuroRadioについて</h2>
      </div>
      <div class="about-grid">
        <p>NeuroRadioは神経科学者が、大西洋を越えて収録している日本語ポッドキャストです。神経科学の新着論文、研究業界、海外での研究生活などについて話しています。</p>
        <div class="starter-grid" aria-label="新しく聴く方向けの入口">
          <a href="#episodes">ゲスト回</a>
          <a href="#topics">論文解説</a>
          <a href="#topics">研究生活</a>
          <a href="#topics">キャリア・PI</a>
        </div>
      </div>
    </section>

    <section class="episodes-section" id="episodes" aria-labelledby="episodes-title">
      <div class="section-heading">
        <p class="eyebrow">Recent Episodes</p>
        <h2 id="episodes-title">最近のエピソード</h2>
      </div>
      <div class="episode-grid">
        ${episodes.slice(0, 5).map(episodeCard).join("\n        ")}
      </div>
    </section>

    <section class="topics-section" id="topics" aria-labelledby="topics-title">
      <div class="section-heading">
        <p class="eyebrow">Topics</p>
        <h2 id="topics-title">トピックから探す</h2>
      </div>
      <div class="topic-controls" aria-label="エピソードをトピックで絞り込む">
        ${topicButtons()}
      </div>
    </section>

    <section class="feature-section" aria-labelledby="feature-title">
      <div class="feature-copy">
        <p class="eyebrow">Featured Notes</p>
        <h2 id="feature-title">${latest.title} Show Notes</h2>
        <p>${latest.summary}</p>
      </div>
      <div class="notes-grid">
        <article><h3>Show Notes</h3><p>個別ページに、元記事と同じShow Notesを掲載しています。</p></article>
        <article><h3>Editorial Notes</h3><p>編集後記も個別ページで読めます。</p></article>
        <article><h3>Permalink</h3><p><a href="${latest.path}">このエピソードを見る</a></p></article>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>NeuroRadio</strong>
      <p>神経科学者による日本語Podcast。</p>
      <p><small>&copy; NeuroRadio</small></p>
    </div>
    <div class="footer-links">
      <a href="https://anchor.fm/neuroradio">Archive</a>
      <a href="https://anchor.fm/s/4ddf5488/podcast/rss">RSS</a>
      <a href="https://neuroradio.tokyo/sample-page/">About</a>
    </div>
  </footer>

  <script src="script.js?v=20260525"></script>
</body>
</html>
`;
}

function navLinks(index) {
  const newer = episodes[index - 1];
  const older = episodes[index + 1];
  const links = [];
  if (newer) links.push(`<a href="${newer.path}">次のエピソード</a>`);
  links.push('<a href="/">トップへ</a>');
  if (older) links.push(`<a href="${older.path}">前のエピソード</a>`);
  return links.join("\n        ");
}

function renderEpisodePage(episode, index) {
  const description = escapeHtml(plainText(episode.summary));
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${episode.title} | NeuroRadio</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${episode.title} | NeuroRadio">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="/assets/neuroradio-cover.svg">
  <link rel="stylesheet" href="/styles.css?v=20260525">
</head>
<body>
  <a class="skip-link" href="#main">本文へスキップ</a>
  ${header({ rootPath: "" })}

  <main id="main" class="episode-page">
    <article class="episode-detail">
      <p class="eyebrow">Podcast</p>
      <h1>${episode.title}</h1>
      <p class="episode-date">${episode.date}</p>
      <p class="hero-lede">${episode.summary}</p>
      ${spotifyEmbed(episode.spotifyEmbedSrc)}
      <section class="episode-content" aria-label="${episode.title} のShow NotesとEditorial Notes">
        <h2 id="show-notes">Show Notes</h2>
${showNotesHtml(episode)}
        <h2 id="editorial-notes">Editorial Notes</h2>
${editorialNotesHtml(episode)}
      </section>
      <nav class="episode-nav" aria-label="エピソードナビゲーション">
        ${navLinks(index)}
      </nav>
    </article>
  </main>

  <script src="/script.js?v=20260525"></script>
</body>
</html>
`;
}

function validateEpisode(episode) {
  const required = ["number", "title", "date", "path", "summary", "spotifyEmbedSrc"];
  for (const key of required) {
    if (!episode[key]) {
      throw new Error(`Episode ${episode.title || episode.number || "unknown"} is missing ${key}`);
    }
  }

  if (!episode.path.startsWith("/") || !episode.path.endsWith("/")) {
    throw new Error(`Episode path must be root-relative and end in slash: ${episode.path}`);
  }
}

for (const episode of episodes) {
  validateEpisode(episode);
}

writeFileSync(join(root, "index.html"), renderHome());

for (const [index, episode] of episodes.entries()) {
  const target = join(root, episode.path, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderEpisodePage(episode, index));
}

console.log(`Built homepage and ${episodes.length} episode pages from data/episodes.json.`);
