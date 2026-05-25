# NeuroRadio Static Site

NeuroRadioのGitHub Pages向け静的サイトプロトタイプです。

## Preview locally

For producer editing, serve the working folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/
```

For a public preview that excludes the local producer form:

```bash
node tools/build-public.mjs
python3 -m http.server 4174 --directory public
```

Then open:

```text
http://localhost:4174/
```

## GitHub Pages deployment notes

This site is intentionally plain static HTML/CSS/JavaScript. The public deploy artifact is generated into:

```text
public/
```

`admin.html` and `assets/admin.js` are local producer tools and are not copied into `public/`.

Recommended Pages setup once the repo is ready to publish:

1. Push this branch or copy these files to the repository branch you want to publish.
2. In GitHub, open `Settings` -> `Pages`.
3. Set source to `GitHub Actions`.
4. Run the included `Deploy static site to GitHub Pages` workflow.

The workflow runs `node tools/build-public.mjs` and deploys only the generated `public/` folder.

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
- `tools/build-public.mjs` - generator for the public deploy folder without admin tools
- `tools/add-episode.mjs` - helper for adding one new episode from a draft JSON file
- `.github/workflows/pages.yml` - GitHub Pages workflow that deploys only `public/`
- `404.html` - GitHub Pages fallback page
- `.nojekyll` - disables Jekyll processing on GitHub Pages
