// Сборка: сначала Vite, затем пререндер.
// Пререндер не должен ронять билд — без него сайт остаётся рабочим SPA,
// поэтому его ошибки логируются, но код выхода остаётся нулевым.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import process from "node:process";

const run = (cmd, args) =>
  spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });

const mode = process.argv[2] === "dev" ? ["--mode", "development"] : [];

const vite = run("npx", ["vite", "build", ...mode]);
if (vite.status !== 0) {
  console.error("Vite build упал — прерываю сборку.");
  process.exit(vite.status ?? 1);
}

if (!existsSync("dist") || readdirSync("dist").length === 0) {
  console.error("dist пуст после vite build.");
  process.exit(1);
}

const pre = run("npx", ["tsx", "scripts/prerender.ts"]);
if (pre.status !== 0) {
  console.warn(
    "Пререндер не отработал — деплой продолжается с обычным SPA. Проверьте scripts/prerender.ts.",
  );
}

console.log("Сборка завершена.");
