# NeuroRadio Static Site

NeuroRadioのGitHub Pages向け静的サイトプロトタイプです。

## Preview locally

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/
```

## GitHub Pages deployment notes

This site is intentionally plain static HTML/CSS/JavaScript. No build step is required.

Recommended Pages setup once the repo is ready to publish:

1. Push this branch or copy these files to the repository branch you want to publish.
2. In GitHub, open `Settings` -> `Pages`.
3. Set source to `Deploy from a branch`.
4. Select the branch and `/ (root)` folder.
5. Save.

`.nojekyll` is included so GitHub Pages serves the static files directly without Jekyll processing.

## Add a new episode

The source of truth is:

```text
data/episodes.json
```

The easiest workflow is to use the local form:

```text
http://localhost:4173/admin.html
```

Paste a Google Docs-style draft with labels such as `Title:`, `Show Notes:`, and `Editorial Notes:`.
The form generates the episode JSON for you.

Save the generated JSON to `/tmp/neuroradio-new-episode.json`, then run:

```bash
node tools/add-episode.mjs /tmp/neuroradio-new-episode.json
```

You can also copy the draft template manually:

```bash
cp data/new-episode.example.json /tmp/neuroradio-new-episode.json
```

Edit `/tmp/neuroradio-new-episode.json`, then run:

```bash
node tools/add-episode.mjs /tmp/neuroradio-new-episode.json
```

The command will:

1. add the new episode to `data/episodes.json`
2. generate the individual episode page at the original-style path
3. update `index.html` so the new episode becomes the latest episode
4. run the static site checks

Required draft fields:

- `number`
- `title`
- `date`
- `summary`
- `spotifyEmbedSrc`
- `showNotes`
- `editorialNotes`

Optional:

- `topics`
- `path` if you need to override the automatically generated path
- `showNotesHtml` / `editorialNotesHtml` for imported WordPress-style HTML

You can also edit `data/episodes.json` directly and rebuild:

```bash
node tools/build-site.mjs
node tools/check-build-workflow.mjs
node tools/check-static-site.mjs
```

## Files

- `index.html` - main Japanese podcast homepage
- `styles.css` - responsive visual system
- `script.js` - mobile navigation and topic filtering
- `assets/neuroradio-cover.svg` - local cover artwork
- `data/episodes.json` - episode data source
- `tools/build-site.mjs` - generator for homepage and episode pages
- `tools/add-episode.mjs` - helper for adding one new episode from a draft JSON file
- `404.html` - GitHub Pages fallback page
- `.nojekyll` - disables Jekyll processing on GitHub Pages
