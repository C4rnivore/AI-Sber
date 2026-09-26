import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontend = path.join(root, "frontend");

function toFrontendRelative(file) {
  const absolute = path.resolve(root, file);
  const relative = path.relative(frontend, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return relative.split(path.sep).join("/");
}

function runBun(args) {
  const result = spawnSync("bun", args, {
    cwd: frontend,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(
      "Не удалось запустить bun. Установите bun и выполните `bun install` в frontend/."
    );
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

const mode = process.argv[2];
const files = process.argv.slice(3);

if (mode === "eslint") {
  const targets = files.map(toFrontendRelative).filter(Boolean);
  if (targets.length === 0) {
    process.exit(0);
  }
  runBun(["x", "eslint", "--no-warn-ignored", ...targets]);
} else if (mode === "tsc") {
  runBun(["x", "tsc", "--noEmit"]);
} else {
  console.error("usage: precommit-frontend.mjs eslint|tsc [files...]");
  process.exit(2);
}
