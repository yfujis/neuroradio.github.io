import { parseEpisodeDraft, slugify } from "../assets/admin.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const pasted = `
Episode: 105
Title: #105 New Memory Episode
Date: 2026-06-01
Spotify: https://open.spotify.com/embed/episode/example105
Topics: 記憶, 研究生活, ゲスト回
Summary:
これはGoogle Docsから貼り付けた概要です。

Show Notes:
- <a href="https://example.com/paper">Paper</a>
- 研究生活について
- ゲストのラボ

Editorial Notes:
- とてもよい回でした。（藤）
- 追加コメントです。（脇）
`;

const draft = parseEpisodeDraft(pasted);

assert(draft.number === "105", "Should parse episode number");
assert(draft.title === "#105 New Memory Episode", "Should parse title");
assert(draft.date === "2026-06-01", "Should parse date");
assert(draft.spotifyEmbedSrc === "https://open.spotify.com/embed/episode/example105", "Should parse Spotify URL");
assert(draft.path === "/2026/06/01/105-new-memory-episode/", "Should create original-style path");
assert(draft.summary === "これはGoogle Docsから貼り付けた概要です。", "Should parse summary block");
assert(draft.topics.length === 3 && draft.topics.includes("記憶"), "Should parse topics");
assert(draft.showNotes.length === 3 && draft.showNotes[0].includes("Paper"), "Should parse show notes");
assert(draft.editorialNotes.length === 2 && draft.editorialNotes[1].includes("追加コメント"), "Should parse editorial notes");
assert(slugify("#105 New Memory Episode") === "new-memory-episode", "Should slugify title");

console.log("Admin parser check passed.");
