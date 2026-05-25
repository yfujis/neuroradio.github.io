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

## Files

- `index.html` - main Japanese podcast homepage
- `styles.css` - responsive visual system
- `script.js` - mobile navigation and topic filtering
- `assets/neuroradio-cover.svg` - local cover artwork
- `404.html` - GitHub Pages fallback page
- `.nojekyll` - disables Jekyll processing on GitHub Pages
