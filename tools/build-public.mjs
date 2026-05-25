import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function copy(path) {
  cpSync(join(root, path), join(publicDir, path), { recursive: true });
}

run("node", ["tools/build-site.mjs"]);

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

for (const path of [
  ".nojekyll",
  "404.html",
  "index.html",
  "script.js",
  "styles.css",
  "assets/neuroradio-cover.svg",
  "data/episodes.json",
  "2025",
  "2026",
]) {
  if (existsSync(join(root, path))) {
    copy(path);
  }
}

console.log("Built public site in ./public without admin files.");
