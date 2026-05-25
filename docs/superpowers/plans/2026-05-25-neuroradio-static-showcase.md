# NeuroRadio Static Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Japanese-first NeuroRadio showcase site with a listen-first homepage, real recent episodes, clear subscription paths, topic discovery, and responsive polish.

**Architecture:** Use plain static files so the prototype can be opened directly or served by any simple local server. `index.html` owns semantic content and real episode data, `styles.css` owns layout/visual system/responsiveness, and `script.js` owns lightweight progressive enhancement for mobile navigation and topic filtering.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, no build system, no package dependencies.

---

## File Structure

- Create `index.html`: complete Japanese single-page site with semantic sections, real recent episodes, subscription links, metadata, and accessible markup.
- Create `styles.css`: visual system, layout, cards, buttons, responsive behavior, focus states, and print-safe defaults.
- Create `script.js`: mobile menu toggle and optional episode topic filtering.
- Create `assets/neuroradio-cover.svg`: simple local vector cover/hero asset inspired by the current podcast identity so the site has a real visual signal without depending on remote images.

## Content Sources

Use the following real recent episode summaries from the current site:

- `#104 Empire Social State of Mind`: `東京科学大学 黒田研究室 特任准教授の小坂田拓哉さんゲスト回。NYUでのオキシトシン&社会行動の研究、久しぶりの日本での研究生活、NYCの思い出等。`
- `#103 Real Projections and Tangential Matters`: `COSYNE2026の様子、ポルトガル旅行、萩原ラボ立ち上げ等、近況報告雑談。`
- `#102 Dome Sweet Dome: Where Memory Finds Its Rhythm`: `Johns Hopkins University、Neuroscience PhD Candidateの末岡陽太朗さんゲスト回。今年出た1つ目のPhDメイン仕事、theta precession、JHUやMITでの学生生活、など。`
- `#101 Taco Chronicles`: `SfN2025反省会。メキシコ旅行、学会での社交、ポスター発表でのコミュニケーション方法など雑談。`
- `#100 Everything In Its Right Place`: `自然科学研究機構・生理学研究所にて独立する萩原賢太さんゲスト回。アメリカの現状と脱出に至る過程、立ち上げるラボでのプロジェクト、五十嵐ラボ@東北大、など。`

Use these links:

- Latest episode: `https://neuroradio.tokyo/2026/05/12/104-empire-social-state-of-mind/`
- Apple Podcasts: `https://podcasts.apple.com/jp/podcast/neuroradio/id1556937028`
- Spotify: `https://open.spotify.com/show/2EA3S51dcQ0pRUTCX2ivsF`
- RSS: `https://anchor.fm/s/4ddf5488/podcast/rss`
- Anchor/Spotify for Podcasters archive: `https://anchor.fm/neuroradio`

Use `#youtube-music` as a disabled/demo link if no verified YouTube Music URL is available during implementation. Label it clearly as `YouTube Music` without claiming a working external URL.

### Task 1: Static Content And Asset

**Files:**
- Create: `index.html`
- Create: `assets/neuroradio-cover.svg`

- [ ] **Step 1: Create the cover asset**

Create `assets/neuroradio-cover.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-labelledby="title desc">
  <title id="title">NeuroRadio cover artwork</title>
  <desc id="desc">Dark square artwork with abstract neural arcs and the NeuroRadio title.</desc>
  <rect width="1200" height="1200" fill="#070707"/>
  <g fill="none" stroke="#f6f4ec" stroke-linecap="round">
    <path d="M134 636c141-312 301-428 479-347 181 82 323 28 453-164" stroke-width="10" opacity=".22"/>
    <path d="M150 806c178-222 355-269 530-139 154 114 278 103 373-31" stroke-width="8" opacity=".28"/>
    <path d="M216 402c128 83 236 91 324 24 105-80 207-72 305 24" stroke-width="6" opacity=".18"/>
  </g>
  <g fill="#f6f4ec">
    <circle cx="206" cy="402" r="10"/>
    <circle cx="344" cy="504" r="5"/>
    <circle cx="474" cy="448" r="7"/>
    <circle cx="626" cy="340" r="8"/>
    <circle cx="832" cy="458" r="6"/>
    <circle cx="997" cy="198" r="9"/>
    <circle cx="246" cy="772" r="7"/>
    <circle cx="526" cy="654" r="10"/>
    <circle cx="820" cy="730" r="6"/>
    <circle cx="1004" cy="632" r="8"/>
  </g>
  <text x="92" y="982" fill="#f6f4ec" font-family="Georgia, 'Times New Roman', serif" font-size="108">Neuro</text>
  <text x="92" y="1092" fill="#f6f4ec" font-family="Georgia, 'Times New Roman', serif" font-size="108">Radio</text>
</svg>
```

- [ ] **Step 2: Create `index.html`**

Create `index.html` with semantic content matching the spec:

```html
<!doctype html>
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
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#main">本文へスキップ</a>

  <header class="site-header">
    <nav class="nav" aria-label="メインナビゲーション">
      <a class="brand" href="#top" aria-label="NeuroRadio ホーム">
        <span class="brand-main">NeuroRadio</span>
        <span class="brand-sub">Podcast by neuroscientists</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-label">Menu</span>
      </button>
      <div class="nav-links" id="nav-links">
        <a href="#latest">最新回</a>
        <a href="#about">About</a>
        <a href="#episodes">エピソード</a>
        <a href="#topics">トピック</a>
        <a class="nav-cta" href="#subscribe">購読</a>
      </div>
    </nav>
  </header>

  <main id="main">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">神経科学者によるPodcast</p>
        <h1 id="hero-title">研究者の会話を、そのまま聴く。</h1>
        <p class="hero-lede">NeuroRadioは、神経科学の新着論文、研究業界、海外での研究生活を語る日本語ポッドキャストです。</p>
        <div class="hero-actions" aria-label="主要アクション">
          <a class="button primary" href="https://neuroradio.tokyo/2026/05/12/104-empire-social-state-of-mind/">最新回を聴く</a>
          <a class="button secondary" href="#subscribe">購読する</a>
        </div>
      </div>
      <article class="latest-card" id="latest" aria-labelledby="latest-title">
        <div class="latest-art">
          <img src="assets/neuroradio-cover.svg" alt="NeuroRadioのカバーアート">
        </div>
        <div class="latest-body">
          <p class="eyebrow">最新回</p>
          <h2 id="latest-title">#104 Empire Social State of Mind</h2>
          <p>東京科学大学 黒田研究室 特任准教授の小坂田拓哉さんゲスト回。NYUでのオキシトシン&社会行動の研究、久しぶりの日本での研究生活、NYCの思い出等。</p>
          <div class="player-bar" aria-label="ポッドキャストプレイヤー風の表示">
            <span class="play-icon" aria-hidden="true"></span>
            <span>May 12 · NeuroRadio</span>
          </div>
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
        <a class="platform disabled" href="#youtube-music" aria-disabled="true">YouTube Music</a>
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
        <div class="starter-grid" aria-label="初めて聴く方向けの入口">
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
        <article class="episode-card" data-topics="社会行動 研究生活 ゲスト回">
          <p class="episode-date">2026-05-12</p>
          <h3>#104 Empire Social State of Mind</h3>
          <p>東京科学大学 黒田研究室 特任准教授の小坂田拓哉さんゲスト回。NYUでのオキシトシン&社会行動の研究、久しぶりの日本での研究生活、NYCの思い出等。</p>
          <div class="tags"><span>社会行動</span><span>研究生活</span><span>ゲスト回</span></div>
          <a href="https://neuroradio.tokyo/2026/05/12/104-empire-social-state-of-mind/">詳細を見る</a>
        </article>
        <article class="episode-card" data-topics="学会 研究生活">
          <p class="episode-date">2026-04-08</p>
          <h3>#103 Real Projections and Tangential Matters</h3>
          <p>COSYNE2026の様子、ポルトガル旅行、萩原ラボ立ち上げ等、近況報告雑談。</p>
          <div class="tags"><span>学会</span><span>研究生活</span></div>
          <a href="https://neuroradio.tokyo/2026/04/08/103-real-projections-and-tangential-matters/">詳細を見る</a>
        </article>
        <article class="episode-card" data-topics="記憶 論文解説 留学 ゲスト回">
          <p class="episode-date">2025-12-31</p>
          <h3>#102 Dome Sweet Dome: Where Memory Finds Its Rhythm</h3>
          <p>Johns Hopkins University、Neuroscience PhD Candidateの末岡陽太朗さんゲスト回。今年出た1つ目のPhDメイン仕事、theta precession、JHUやMITでの学生生活、など。</p>
          <div class="tags"><span>記憶</span><span>論文解説</span><span>留学</span></div>
          <a href="https://neuroradio.tokyo/2025/12/31/102-dome-sweet-dome-where-memory-finds-its-rhythm/">詳細を見る</a>
        </article>
        <article class="episode-card" data-topics="学会 研究生活">
          <p class="episode-date">2025-12-24</p>
          <h3>#101 Taco Chronicles</h3>
          <p>SfN2025反省会。メキシコ旅行、学会での社交、ポスター発表でのコミュニケーション方法など雑談。</p>
          <div class="tags"><span>学会</span><span>研究生活</span></div>
          <a href="https://neuroradio.tokyo/2025/12/24/101-taco-chronicles/">詳細を見る</a>
        </article>
        <article class="episode-card" data-topics="PI キャリア 研究生活 ゲスト回">
          <p class="episode-date">2025-11-01</p>
          <h3>#100 Everything In Its Right Place</h3>
          <p>自然科学研究機構・生理学研究所にて独立する萩原賢太さんゲスト回。アメリカの現状と脱出に至る過程、立ち上げるラボでのプロジェクト、五十嵐ラボ@東北大、など。</p>
          <div class="tags"><span>PI・キャリア</span><span>研究生活</span><span>ゲスト回</span></div>
          <a href="https://neuroradio.tokyo/2025/11/01/100-everything-in-its-right-place/">詳細を見る</a>
        </article>
      </div>
    </section>

    <section class="topics-section" id="topics" aria-labelledby="topics-title">
      <div class="section-heading">
        <p class="eyebrow">Topics</p>
        <h2 id="topics-title">トピックから探す</h2>
      </div>
      <div class="topic-controls" aria-label="エピソードをトピックで絞り込む">
        <button type="button" class="topic-filter active" data-filter="all">すべて</button>
        <button type="button" class="topic-filter" data-filter="社会行動">社会行動</button>
        <button type="button" class="topic-filter" data-filter="記憶">記憶</button>
        <button type="button" class="topic-filter" data-filter="学会">学会</button>
        <button type="button" class="topic-filter" data-filter="留学">留学</button>
        <button type="button" class="topic-filter" data-filter="PI">PI・キャリア</button>
        <button type="button" class="topic-filter" data-filter="研究生活">研究生活</button>
      </div>
    </section>

    <section class="feature-section" aria-labelledby="feature-title">
      <div class="feature-copy">
        <p class="eyebrow">Featured Notes</p>
        <h2 id="feature-title">#104 Show Notes Preview</h2>
        <p>小坂田拓哉さん、Dayu Linラボ、オキシトシン、社会行動、NYCのベーグル、研究生活など、番組らしい密度のある関連リンクが並ぶ回です。</p>
      </div>
      <div class="notes-grid">
        <article><h3>Guest</h3><p>小坂田拓哉さん / 東京科学大学 黒田研究室</p></article>
        <article><h3>Papers</h3><p>Osakada et al., 2024 など社会行動・神経回路に関する話題。</p></article>
        <article><h3>Editorial Notes</h3><p>研究の話から働き方、メンタリング、番組らしい余白まで。</p></article>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>NeuroRadio</strong>
      <p>神経科学者による日本語Podcast。</p>
    </div>
    <div class="footer-links">
      <a href="https://anchor.fm/neuroradio">Archive</a>
      <a href="https://anchor.fm/s/4ddf5488/podcast/rss">RSS</a>
      <a href="https://neuroradio.tokyo/sample-page/">About</a>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 3: Commit content**

Run:

```bash
git add index.html assets/neuroradio-cover.svg
git commit -m "Add NeuroRadio static site content"
```

Expected: commit succeeds with `index.html` and `assets/neuroradio-cover.svg`.

### Task 2: Styling And Responsive Layout

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Create `styles.css`**

Create `styles.css` with:

```css
:root {
  --ink: #141414;
  --muted: #62615e;
  --paper: #f7f6f1;
  --panel: #ffffff;
  --line: #dedbd2;
  --accent: #8b1a8f;
  --accent-dark: #171017;
  --soft: #ece8df;
  --radius: 8px;
  --shadow: 0 22px 60px rgba(20, 20, 20, .08);
  color-scheme: light;
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "YuGothic", "Noto Sans JP", sans-serif;
  line-height: 1.75;
}

a {
  color: inherit;
  text-underline-offset: .22em;
}

img {
  display: block;
  max-width: 100%;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: .5rem;
  transform: translateY(-150%);
  background: var(--ink);
  color: #fff;
  padding: .5rem .75rem;
  z-index: 10;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(247, 246, 241, .92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(14px);
}

.nav {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  text-decoration: none;
  display: grid;
  gap: 0;
}

.brand-main {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  line-height: 1;
}

.brand-sub {
  color: var(--muted);
  font-size: .82rem;
  font-style: italic;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 22px;
  font-size: .94rem;
}

.nav-links a {
  text-decoration: none;
}

.nav-cta,
.button,
.platform,
.topic-filter {
  min-height: 44px;
  border-radius: var(--radius);
}

.nav-cta {
  border: 1px solid var(--ink);
  padding: .55rem .9rem;
}

.nav-toggle {
  display: none;
}

main {
  overflow: hidden;
}

.hero,
.subscribe-section,
.about-section,
.episodes-section,
.topics-section,
.feature-section,
.site-footer {
  max-width: 1180px;
  margin: 0 auto;
  padding: 72px 24px;
}

.hero {
  min-height: calc(100vh - 82px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
  align-items: center;
  gap: 48px;
}

.eyebrow {
  color: var(--accent);
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 10px;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  overflow-wrap: anywhere;
}

h1,
h2,
h3 {
  line-height: 1.25;
}

h1 {
  font-family: Georgia, "Times New Roman", "Hiragino Mincho ProN", serif;
  font-size: clamp(2.6rem, 7vw, 5.8rem);
  margin: 0 0 22px;
}

h2 {
  font-family: Georgia, "Times New Roman", "Hiragino Mincho ProN", serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  margin: 0;
}

h3 {
  font-size: 1.25rem;
  margin: 0 0 12px;
}

.hero-lede {
  max-width: 660px;
  color: var(--muted);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
}

.hero-actions,
.platform-grid,
.topic-controls,
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button,
.platform,
.topic-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  padding: .72rem 1rem;
  text-decoration: none;
  font-weight: 700;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.button.primary {
  background: var(--ink);
  color: #fff;
}

.button.secondary {
  background: var(--panel);
}

.latest-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.latest-art {
  background: #090909;
}

.latest-art img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.latest-body {
  padding: 24px;
}

.player-bar {
  margin-top: 18px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.play-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  position: relative;
  flex: 0 0 auto;
}

.play-icon::after {
  content: "";
  position: absolute;
  left: 12px;
  top: 8px;
  border-left: 10px solid var(--accent);
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
}

.subscribe-section,
.about-section,
.feature-section {
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 36px;
}

.platform-grid {
  align-content: start;
}

.platform {
  background: var(--panel);
  min-width: 160px;
}

.platform.disabled {
  color: var(--muted);
  border-style: dashed;
}

.section-heading {
  margin-bottom: 28px;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, .85fr);
  gap: 24px;
}

.starter-grid,
.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.starter-grid a,
.notes-grid article,
.episode-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.starter-grid a {
  padding: 18px;
  text-decoration: none;
  font-weight: 700;
}

.episode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.episode-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.episode-card[hidden] {
  display: none;
}

.episode-date {
  color: var(--muted);
  font-size: .9rem;
  margin: 0;
}

.episode-card p {
  margin: 0;
}

.episode-card a {
  margin-top: auto;
  font-weight: 700;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  background: var(--soft);
  border-radius: 999px;
  padding: .2rem .55rem;
  font-size: .82rem;
}

.topic-filter {
  background: var(--panel);
}

.topic-filter.active {
  background: var(--ink);
  color: #fff;
}

.feature-section {
  align-items: start;
}

.notes-grid article {
  padding: 20px;
}

.site-footer {
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--muted);
}

.site-footer strong {
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
}

@media (max-width: 860px) {
  .nav {
    align-items: start;
  }

  .nav-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--line);
    background: var(--panel);
    padding: .55rem .75rem;
    min-height: 44px;
    border-radius: var(--radius);
  }

  .nav-toggle-bar,
  .nav-toggle-bar::before,
  .nav-toggle-bar::after {
    display: block;
    width: 18px;
    height: 2px;
    background: var(--ink);
    position: relative;
  }

  .nav-toggle-bar::before,
  .nav-toggle-bar::after {
    content: "";
    position: absolute;
    left: 0;
  }

  .nav-toggle-bar::before { top: -6px; }
  .nav-toggle-bar::after { top: 6px; }

  .nav-links {
    position: absolute;
    left: 24px;
    right: 24px;
    top: 82px;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 8px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    padding: 12px;
  }

  .hero,
  .subscribe-section,
  .about-section,
  .feature-section {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: auto;
    padding-top: 46px;
  }

  .about-grid,
  .episode-grid,
  .starter-grid,
  .notes-grid {
    grid-template-columns: 1fr;
  }

  .site-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .nav,
  .hero,
  .subscribe-section,
  .about-section,
  .episodes-section,
  .topics-section,
  .feature-section,
  .site-footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hero,
  .subscribe-section,
  .about-section,
  .episodes-section,
  .topics-section,
  .feature-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .hero-actions .button,
  .platform,
  .topic-filter {
    width: 100%;
  }

  .latest-body,
  .episode-card {
    padding: 18px;
  }
}
```

- [ ] **Step 2: Commit styling**

Run:

```bash
git add styles.css
git commit -m "Style NeuroRadio static showcase"
```

Expected: commit succeeds with `styles.css`.

### Task 3: Lightweight Interaction

**Files:**
- Create: `script.js`

- [ ] **Step 1: Create `script.js`**

Create `script.js` with:

```js
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const filters = document.querySelectorAll(".topic-filter");
const episodes = document.querySelectorAll(".episode-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.getAttribute("data-filter") || "all";

    filters.forEach((button) => {
      button.classList.toggle("active", button === filter);
    });

    episodes.forEach((episode) => {
      const topics = episode.getAttribute("data-topics") || "";
      episode.hidden = selected !== "all" && !topics.includes(selected);
    });
  });
});
```

- [ ] **Step 2: Commit interaction**

Run:

```bash
git add script.js
git commit -m "Add static site interactions"
```

Expected: commit succeeds with `script.js`.

### Task 4: Verification And Polish

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `styles.css`
- Modify if needed: `script.js`

- [ ] **Step 1: Run local static server**

Run:

```bash
python3 -m http.server 4173
```

Expected: server starts at `http://localhost:4173`.

- [ ] **Step 2: Verify desktop in browser**

Open `http://localhost:4173` and check:

- Japanese copy appears correctly.
- Header contains `About` in alphabet.
- Latest episode and subscription actions are visible in the first viewport.
- The cover asset renders.
- Recent episode cards show real episode summaries.
- Topic filter buttons hide/show relevant cards.

- [ ] **Step 3: Verify mobile in browser**

Use a mobile-width viewport and check:

- Header menu opens and closes.
- `購読` remains easy to reach.
- Long episode titles wrap without overlap.
- Cards stack cleanly.
- Player-style bar does not overflow.

- [ ] **Step 4: Check files for accidental placeholders**

Run:

```bash
rg -n "TODO|TBD|placeholder|lorem|初めての方へ|Google Podcasts" index.html styles.css script.js docs/superpowers/specs/2026-05-25-neuroradio-static-showcase-design.md
```

Expected: no matches that indicate unfinished site content. `初めての方へ` should not appear as a nav label.

- [ ] **Step 5: Commit verification fixes**

If any fixes were needed, run:

```bash
git add index.html styles.css script.js assets/neuroradio-cover.svg
git commit -m "Polish NeuroRadio static showcase"
```

Expected: commit succeeds only if files changed.

## Self-Review

Spec coverage:

- Japanese-first content: Task 1.
- `About` alphabet nav label: Task 1 and Task 4 verification.
- Static site with no build system: Tasks 1-3.
- Real recent episodes: Task 1 content source and episode cards.
- Modern podcast CTA direction: Tasks 1-2.
- Subscription section without Google Podcasts: Task 1.
- Topic discovery: Tasks 1 and 3.
- Featured episode notes preview: Task 1.
- Responsive behavior: Task 2 and Task 4.
- Accessibility and SEO: Task 1 metadata/semantics and Task 2 focus/layout.

Placeholder scan:

- No `TBD` or `TODO`.
- The word `placeholder` appears only in the verification command as a search term, not as required page content.

Type consistency:

- Topic filtering uses `.topic-filter`, `.episode-card`, and `data-filter`/`data-topics` consistently across HTML and JavaScript.
