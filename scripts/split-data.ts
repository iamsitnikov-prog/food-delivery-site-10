/**
 * Разрезает большие файлы данных на части для быстрой загрузки страниц.
 *
 * Зачем: раньше на любую страницу термина, статьи или калькулятора браузер
 * скачивал целиком все 146 терминов и 54 статьи — около 1,5 МБ кода ради
 * одного текста. Здесь мы один раз при сборке готовим:
 *   - лёгкий индекс (название, категория, короткое описание) — он нужен
 *     списку, поиску и перелинковке;
 *   - отдельный файл на каждый термин и каждую статью — он подгружается
 *     только когда читатель открыл именно этот материал.
 *
 * Запускается автоматически перед сборкой (npm run build).
 * Результат складывается в src/data/generated и коммитится вместе с кодом.
 */
import fs from "fs";
import path from "path";
import { GLOSSARY } from "../src/data/glossary";
import { BLOG_POSTS } from "../src/data/blog-posts";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "src", "data", "generated");
const TERMS = path.join(OUT, "terms");
const POSTS = path.join(OUT, "posts");

const reset = (dir: string) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

reset(OUT);
reset(TERMS);
reset(POSTS);

// --- Термины ----------------------------------------------------------------
// В индекс берём то, что показывают карточки списка и что нужно поиску,
// перелинковке и блоку «смотрите также». Развёрнутая часть — в файл термина.
const termIndex = GLOSSARY.map((t) => ({
  slug: t.slug,
  term: t.term,
  short: t.short,
  letter: t.letter,
  group: t.group,
  see: t.see,
}));

// Карточки списка /slovar показывают ещё и развёрнутое описание со формулой.
// Это заметно тяжелее индекса, поэтому лежит отдельно и грузится только
// на самой странице глоссария.
const termCards = GLOSSARY.map((t) => ({
  slug: t.slug,
  term: t.term,
  short: t.short,
  full: t.full,
  formula: t.formula,
  example: t.example,
  letter: t.letter,
  group: t.group,
  see: t.see,
  links: t.links,
}));

for (const t of GLOSSARY) {
  fs.writeFileSync(
    path.join(TERMS, `${t.slug}.json`),
    JSON.stringify(t),
    "utf-8",
  );
}

fs.writeFileSync(
  path.join(OUT, "term-index.json"),
  JSON.stringify(termIndex),
  "utf-8",
);

// Обратные ссылки: какие термины ссылаются на данный адрес.
// Раньше это считалось в браузере по полным данным всех терминов —
// теперь готовая карта собирается при сборке.
const backlinks: Record<string, string[]> = {};
for (const t of GLOSSARY) {
  for (const l of t.links ?? []) {
    (backlinks[l.to] ??= []).push(t.slug);
  }
}

fs.writeFileSync(
  path.join(OUT, "term-backlinks.json"),
  JSON.stringify(backlinks),
  "utf-8",
);

fs.writeFileSync(
  path.join(OUT, "term-cards.json"),
  JSON.stringify(termCards),
  "utf-8",
);

// --- Статьи блога -----------------------------------------------------------
// Списку блога нужны только заголовок, рубрика и дата. Текст статьи —
// в отдельном файле.
const postIndex = BLOG_POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  h1: p.h1,
  lead: p.lead,
  date: p.date,
  dateLabel: p.dateLabel,
  readTime: p.readTime,
  tag: p.tag,
  isNew: p.isNew,
  pinned: p.pinned,
}));

for (const p of BLOG_POSTS) {
  fs.writeFileSync(
    path.join(POSTS, `${p.slug}.json`),
    JSON.stringify(p),
    "utf-8",
  );
}

fs.writeFileSync(
  path.join(OUT, "post-index.json"),
  JSON.stringify(postIndex),
  "utf-8",
);

const kb = (s: string) => Math.round(Buffer.byteLength(s) / 1024);
console.log(
  `Данные разрезаны: ${GLOSSARY.length} терминов (индекс ${kb(
    JSON.stringify(termIndex),
  )} КБ), ${BLOG_POSTS.length} статей (индекс ${kb(JSON.stringify(postIndex))} КБ)`,
);
