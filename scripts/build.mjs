// Сборка: сначала Vite, затем пререндер статических страниц.
//
// Скрипт намеренно не зависит от npx, PATH и текущей рабочей директории:
// на сборочном сервере они могут отличаться от локальных. Бинарники ищем
// в node_modules/.bin по абсолютному пути, а пререндер запускаем через
// его собственный CLI-файл.
//
// Пререндер не должен ронять деплой: без него сайт остаётся рабочим SPA,
// поэтому его ошибки логируются, но код выхода остаётся нулевым.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BIN = path.join(ROOT, "node_modules", ".bin");
const isWin = process.platform === "win32";

/** Путь до локального бинарника, если он есть. */
const localBin = (name) => {
  for (const candidate of isWin ? [`${name}.cmd`, `${name}.exe`, name] : [name]) {
    const full = path.join(BIN, candidate);
    if (existsSync(full)) return full;
  }
  return null;
};

const run = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: ROOT,
    shell: isWin,
    env: { ...process.env, PATH: `${BIN}${path.delimiter}${process.env.PATH ?? ""}` },
    ...opts,
  });

/* ---------- 1. Сборка Vite ---------- */

const mode = process.argv[2] === "dev" ? ["--mode", "development"] : [];

// Предпочитаем JS-точку входа Vite: она работает без bin-симлинков.
const viteCli = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
const vite = existsSync(viteCli)
  ? run(process.execPath, [viteCli, "build", ...mode])
  : run(localBin("vite") ?? "npx", localBin("vite") ? ["build", ...mode] : ["vite", "build", ...mode]);

if (vite.status !== 0) {
  console.error("[build] Vite build завершился с ошибкой — прерываю сборку.");
  process.exit(vite.status ?? 1);
}

const DIST = path.join(ROOT, "dist");
if (!existsSync(DIST) || readdirSync(DIST).length === 0) {
  console.error("[build] Папка dist пуста после vite build.");
  process.exit(1);
}
if (!existsSync(path.join(DIST, "index.html"))) {
  console.error("[build] В dist нет index.html.");
  process.exit(1);
}

/* ---------- 2. Пререндер (не блокирует деплой) ---------- */

const tsxCli = path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs");
let pre;

if (existsSync(tsxCli)) {
  pre = run(process.execPath, [tsxCli, "scripts/prerender.ts"]);
} else {
  const bin = localBin("tsx");
  pre = bin
    ? run(bin, ["scripts/prerender.ts"])
    : run("npx", ["--yes", "tsx@4.19.2", "scripts/prerender.ts"]);
}

if (!pre || pre.status !== 0) {
  console.warn(
    "[build] Пререндер не отработал. Деплой продолжается: сайт выложится как SPA, " +
      "но без готового HTML для поисковиков. Проверьте scripts/prerender.ts.",
  );
} else {
  console.log("[build] Пререндер выполнен.");
}

/* ---------- 3. Итоговая проверка ---------- */

const files = readdirSync(DIST).length;
console.log(`[build] Готово: ${files} элементов в dist.`);
