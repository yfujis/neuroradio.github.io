# NeuroRadio Jekyll Site

NeuroRadioのGitHub Pages向けJekyllサイトです。現在の見た目は保ちつつ、エピソードはMinimal Mistakesと同じように `_posts/` のMarkdownファイルとして管理します。

## Backup

Jekyll化する前の静的生成版はここにコピーしてあります。

```text
../backups/codex-neuroradio-static-showcase-before-jekyll-20260526
```

## Preview locally

初回だけ依存関係を入れます。

```bash
bundle install
```

ローカルプレビュー:

```bash
bundle exec jekyll serve
```

Then open:

```text
http://localhost:4000/
```

JekyllがMarkdownの変更を監視して自動で再生成します。

If local `bundle install` hits an EventMachine/native extension issue on macOS, the GitHub Actions build should still work on Ubuntu. On this machine I verified the site with the already-installed system Jekyll.

## Add a new episode

`_posts/` に新しいMarkdownファイルを追加します。ファイル名は日付から始めます。

```text
_posts/2026-06-01-new-episode-title.md
```

テンプレート:

```markdown
---
layout: episode
title: "#105 New Episode Title"
episode_number: "105"
date: 2026-06-01
permalink: /2026/06/01/105-new-episode-title/
spotify: "https://open.spotify.com/embed/episode/..."
performers: ["ゲスト名", "宮脇健行", "藤島悠貴"]
topics: ["ゲスト回", "研究生活"]
summary: "ここにエピソードの短い説明を書きます。"
---

Summary:
ここにエピソードの短い説明を書きます。

Show Notes:
1つ目のShow Note
2つ目のShow Note

Editorial Notes:
編集後記をここに書きます。（藤島）
複数人のコメントは項目を分けると読みやすいです。（宮脇）
```

本文側はGoogle Docsから貼りやすいラベル形式です。リンクはMarkdown形式で書きます。

```markdown
[表示テキスト](https://example.com)
```

## Edit an episode

既存エピソードは `_posts/` の該当ファイルを編集します。例:

```text
_posts/2026-04-08-real-projections-and-tangential-matters.md
```

`bundle exec jekyll serve` 実行中なら、保存するとローカルサイトが自動で更新されます。

## GitHub Pages deployment

GitHub PagesはGitHub Actionsで `_site/` をデプロイします。`.github/workflows/pages.yml` が `bundle exec jekyll build` を実行します。

推奨設定:

1. GitHubで `Settings` -> `Pages` を開く。
2. Sourceを `GitHub Actions` にする。
3. mainブランチにpushする、またはworkflowを手動実行する。

## Notes

- `_posts/*.md` がエピソードの編集元です。
- `permalink` を元サイトと同じURLにすることで、移行後もURLを維持します。
- `_plugins/episode_parser.rb` が `Summary:`, `Show Notes:`, `Editorial Notes:` のラベル形式を読み取り、現在のデザインに合うHTMLへ変換します。
- `styles.css` と `script.js` は現在のNeuroRadioデザインをそのまま使います。

## Files

- `_posts/*.md` - エピソード本文
- `_layouts/episode.html` - 個別エピソードの見た目
- `_layouts/default.html` - 共通HTML
- `_includes/` - header/footer/tag UI
- `_plugins/episode_parser.rb` - ラベル形式のMarkdownを読むJekyll plugin
- `index.html` - ホーム
- `episodes/index.html` - エピソード一覧
- `otayori/index.html` - お便りページ
- `styles.css` - responsive visual system
- `script.js` - mobile navigation and archive filtering/pagination
