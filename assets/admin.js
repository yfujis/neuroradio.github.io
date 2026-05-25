export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/^#\d+\s*/, "")
    .replaceAll(/&amp;|&/g, "and")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function cleanLine(line) {
  return line.trim().replace(/^[-*・]\s*/, "");
}

function normalizeSpotifyUrl(value) {
  const trimmed = value.trim();
  if (trimmed.includes("<iframe")) {
    const match = trimmed.match(/src="([^"]+)"/);
    return match ? match[1] : trimmed;
  }
  return trimmed;
}

function sectionName(line) {
  const normalized = line.trim().toLowerCase().replace(/[:：]\s*$/, "");
  const names = new Map([
    ["episode", "number"],
    ["episode number", "number"],
    ["number", "number"],
    ["title", "title"],
    ["date", "date"],
    ["spotify", "spotify"],
    ["spotify embed", "spotify"],
    ["spotify url", "spotify"],
    ["topics", "topics"],
    ["summary", "summary"],
    ["概要", "summary"],
    ["show notes", "showNotes"],
    ["shownotes", "showNotes"],
    ["editorial notes", "editorialNotes"],
    ["editorial note", "editorialNotes"],
    ["編集後記", "editorialNotes"],
  ]);

  return names.get(normalized);
}

function parseSections(text) {
  const sections = {};
  let current = null;

  for (const rawLine of text.replaceAll("\r\n", "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      if (current === "summary") sections[current].push("");
      continue;
    }

    const inline = line.match(/^([^:：]+)[:：]\s*(.*)$/);
    const name = inline ? sectionName(`${inline[1]}:`) : sectionName(line);

    if (name) {
      current = name;
      sections[current] ||= [];
      if (inline?.[2]) sections[current].push(inline[2].trim());
      continue;
    }

    if (current) {
      sections[current].push(line);
    }
  }

  return sections;
}

function first(sections, name) {
  return (sections[name] || []).find(Boolean)?.trim() || "";
}

function list(sections, name) {
  return (sections[name] || []).map(cleanLine).filter(Boolean);
}

export function parseEpisodeDraft(text) {
  const sections = parseSections(text);
  const number = first(sections, "number").replace(/^#/, "");
  const title = first(sections, "title");
  const date = first(sections, "date");
  const spotifyEmbedSrc = normalizeSpotifyUrl(first(sections, "spotify"));
  const topics = first(sections, "topics")
    .split(/[,、]/)
    .map((topic) => topic.trim())
    .filter(Boolean);
  const summary = (sections.summary || []).join("\n").trim();
  const showNotes = list(sections, "showNotes");
  const editorialNotes = list(sections, "editorialNotes");

  const draft = {
    number,
    title,
    date,
    summary,
    spotifyEmbedSrc,
    topics,
    showNotes,
    editorialNotes,
  };

  if (number && title && date) {
    const [year, month, day] = date.split("-");
    draft.path = `/${year}/${month}/${day}/${number}-${slugify(title)}/`;
  }

  return draft;
}

function bindAdminForm() {
  const pasteArea = document.querySelector("#episode-paste");
  const parseButton = document.querySelector("#parse-episode");
  const output = document.querySelector("#episode-json");
  const copyButton = document.querySelector("#copy-json");
  const downloadButton = document.querySelector("#download-json");
  const command = document.querySelector("#episode-command");

  if (!pasteArea || !parseButton || !output) return;

  function render() {
    const draft = parseEpisodeDraft(pasteArea.value);
    const json = `${JSON.stringify(draft, null, 2)}\n`;
    output.value = json;
    if (command) {
      command.textContent = "node tools/add-episode.mjs /tmp/neuroradio-new-episode.json";
    }
    downloadButton?.removeAttribute("disabled");
    copyButton?.removeAttribute("disabled");
  }

  parseButton.addEventListener("click", render);

  copyButton?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(output.value);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy JSON";
    }, 1200);
  });

  downloadButton?.addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "neuroradio-new-episode.json";
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (typeof document !== "undefined") {
  bindAdminForm();
}
