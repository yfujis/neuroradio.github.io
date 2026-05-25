# NeuroRadio Static Showcase Design

## Goal

Build a static Japanese showcase website for NeuroRadio that improves the public-facing listener journey while preserving the identity of the current podcast site. The site should make it immediately clear what NeuroRadio is, let visitors play or open the latest episode quickly, and make subscription paths obvious.

The copy site is a prototype/redesign candidate, not a WordPress migration. It should be easy to preview locally and easy to adapt later.

## Audience

Primary audience:

- Japanese-speaking new listeners interested in neuroscience, research life, academia, and scientific conversation.
- Existing NeuroRadio listeners who want to browse recent episodes and subscribe.

Secondary audience:

- Potential guests, collaborators, and researchers who want to understand the tone and scope of the podcast.

## Content Language

The site must be Japanese-first. Navigation, headings, calls to action, summaries, and explanatory copy should be in Japanese.

Exception: the navigation label `About` should remain in alphabet as requested.

Use real recent episode content from the existing NeuroRadio site. Start with:

- `#104 Empire Social State of Mind`
- `#103 Real Projections and Tangential Matters`
- `#102 Dome Sweet Dome: Where Memory Finds Its Rhythm`
- `#101 Taco Chronicles`
- `#100 Everything In Its Right Place`

Episode summaries should be based on the original Japanese summaries rather than invented placeholder copy.

## Visual Direction

Use the selected direction: `モダンPodcast・明快なCTA`.

The page should feel like a modern podcast home with clear listening/subscription actions. It should not feel like a generic startup landing page. Keep enough restraint from the original site:

- clean layout
- strong Japanese typography
- generous whitespace
- restrained color
- science imagery or podcast artwork used as a real identity signal
- no flashy decorative gradients or purely abstract backgrounds

## Site Type

Build a static showcase site in the empty local workspace.

Expected files:

- `index.html`
- `styles.css`
- `script.js` only if interaction is useful
- local assets if needed

No backend, no CMS, and no build system unless implementation reveals a clear reason.

## Page Structure

The first screen should prioritize listening and subscribing.

Header:

- `NeuroRadio`
- `最新回`
- `About`
- `エピソード`
- `トピック`
- `購読`

Hero / latest episode:

- Label: `最新回`
- Title: `#104 Empire Social State of Mind`
- Japanese summary from the live site
- Prominent actions:
  - `最新回を聴く`
  - `購読する`
- Player-style block or embedded/listen card
- Clear identity text such as `神経科学者によるPodcast`

Subscription section:

- Apple Podcasts
- Spotify
- YouTube Music
- RSS

Do not include Google Podcasts as an active option because it has been discontinued/migrated.

About / first-listen section:

- Keep the nav label as `About`.
- Section content can be Japanese.
- Explain briefly that NeuroRadio is a Japanese podcast by neuroscientists, covering new neuroscience papers, the research community, and research life overseas.
- Include curated entry points for new listeners:
  - `ゲスト回`
  - `論文解説`
  - `研究生活`
  - `キャリア・PI`

Recent episodes:

- Show real recent episodes as cards.
- Include episode number/title, date, short Japanese summary, topic tags, and a listening/detail action.

Topic discovery:

- Include topic chips or cards:
  - `社会行動`
  - `記憶`
  - `学会`
  - `留学`
  - `PI・キャリア`
  - `研究生活`

Featured episode detail:

- Include a richer preview for `#104`:
  - guest/context summary
  - show notes preview
  - related people/papers/places area
  - editorial notes preview

Footer:

- Short Japanese About copy
- subscription links
- contact/social/RSS links where available
- copyright

## Interaction

For the static prototype, interactions should stay lightweight:

- anchor navigation
- topic filtering or highlighting only if it can be implemented cleanly
- accessible mobile menu if the header needs one

The static page must work by opening `index.html` directly in a browser. If local assets or browser behavior make that awkward, use a small local dev server and report the URL.

## Responsive Behavior

Mobile is important.

- Subscription and latest-episode actions must remain visible and easy to tap.
- Long episode titles should wrap cleanly.
- Episode cards should stack.
- The header should not hide the main subscription path too deeply.
- The design should avoid cramped embedded players on narrow screens.

## Accessibility And SEO

Include:

- semantic landmarks
- meaningful headings
- descriptive link/button text
- alt text for images
- reasonable color contrast
- Japanese page metadata
- Open Graph metadata for sharing

## Non-Goals

- Do not rebuild WordPress.
- Do not implement a CMS.
- Do not scrape the entire archive.
- Do not create fake episodes.
- Do not build a full search engine.
- Do not use English as the main site language.

## Success Criteria

The prototype is successful if a first-time Japanese-speaking visitor can:

1. Understand the show within a few seconds.
2. Play or open the latest episode immediately.
3. Subscribe from a clear section.
4. Browse recent real episodes.
5. Find an entry point by topic or listener intent.
6. Feel that the site still belongs to NeuroRadio.
