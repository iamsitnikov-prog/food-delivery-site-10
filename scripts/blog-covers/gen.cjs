// Обложки статей блога 1200×630 (вариант A, утверждён Юрием 22.11.2026).
// Данные карточек: scripts/blog-covers/covers.json, одна запись на статью.
// Запуск из корня репозитория:
//   node scripts/blog-covers/gen.cjs            — все статьи
//   node scripts/blog-covers/gen.cjs slug1,slug2 — только эти
// Картинки ложатся в public/og/blog/<slug>.jpg. После этого запустите
// npm run split-data, чтобы у статьи в индексе появился признак cover.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
(async () => {
  const dir = __dirname;
  const root = path.resolve(dir, "../..");
  const index = JSON.parse(fs.readFileSync(path.join(root, "src/data/generated/post-index.json"), "utf-8"));
  const tag = Object.fromEntries(index.map((p) => [p.slug, p.tag]));
  let specs = JSON.parse(fs.readFileSync(path.join(dir, "covers.json"), "utf-8"));
  const only = process.argv[2] ? process.argv[2].split(",") : null;
  if (only) specs = specs.filter((s) => only.includes(s.slug));
  const out = path.join(root, "public/og/blog");
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(dir, "tpl.html"));
  await p.evaluate(() => document.fonts.ready);
  let warn = 0;
  for (const s of specs) {
    s.tag = s.tag || tag[s.slug];
    if (!s.tag) { console.log("Нет статьи в post-index:", s.slug); warn++; continue; }
    const r = await p.evaluate((x) => render(x), s);
    await p.evaluate(() => document.fonts.ready);
    if (r.over || r.fs < 60) { console.log("Проверьте глазами:", s.slug, JSON.stringify(r)); warn++; }
    await p.screenshot({ path: path.join(out, `${s.slug}.jpg`), type: "jpeg", quality: 88 });
  }
  await b.close();
  const missing = index.filter((x) => !fs.existsSync(path.join(out, `${x.slug}.jpg`))).map((x) => x.slug);
  console.log(`Готово: ${specs.length} обложек. Без обложки: ${missing.length ? missing.join(", ") : "нет"}.`);
  if (warn) process.exitCode = 1;
})();
