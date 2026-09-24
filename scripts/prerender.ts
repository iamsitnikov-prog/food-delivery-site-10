import fs from "fs";
import path from "path";
import { BLOG_POSTS } from "../src/data/blog-posts";
import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages";
import { PARTNERS } from "../src/data/partners";
import { QUIZ_QUESTIONS } from "../src/data/quiz";

const SITE = "https://agregatory.pro";
const OUT = path.resolve(process.cwd(), "public");

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clean = (s: string) => s.replace(/\u00a0/g, " ").trim();

type Page = {
  route: string;
  title: string;
  description: string;
  body: string;
};

const blocksToText = (blocks: any[]): string => {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "p":
        out.push(`<p>${esc(clean(b.text))}</p>`);
        break;
      case "h2":
      case "h3":
        out.push(`<${b.type}>${esc(clean(b.text))}</${b.type}>`);
        break;
      case "list":
      case "numbered": {
        const tag = b.type === "list" ? "ul" : "ol";
        out.push(`<${tag}>${b.items.map((i: string) => `<li>${esc(clean(i))}</li>`).join("")}</${tag}>`);
        break;
      }
      case "quote":
        out.push(`<blockquote>${esc(clean(b.text))}</blockquote>`);
        break;
      case "table": {
        const head = b.head.map((h: string) => `<th>${esc(clean(h))}</th>`).join("");
        const rows = b.rows
          .map((r: string[]) => `<tr>${r.map((c) => `<td>${esc(clean(c))}</td>`).join("")}</tr>`)
          .join("");
        out.push(`<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`);
        break;
      }
      case "partner":
        out.push(`<p>${esc(clean(b.text))} <a href="${esc(b.url)}" rel="nofollow">${esc(clean(b.name))}</a></p>`);
        break;
      default:
        break;
    }
  }
  return out.join("\n");
};

const faqToText = (faq: { q: string; a: string }[] = []) =>
  faq.length
    ? `<h2>Частые вопросы</h2>${faq.map((f) => `<h3>${esc(clean(f.q))}</h3><p>${esc(clean(f.a))}</p>`).join("")}`
    : "";

const pages: Page[] = [];

for (const p of BLOG_POSTS) {
  pages.push({
    route: `/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    body: `<article><h1>${esc(clean(p.h1))}</h1><p>${esc(clean(p.lead))}</p>
<p>Рубрика: ${esc(clean(p.tag))}. Время чтения: ${esc(p.readTime)}.</p>
${blocksToText(p.blocks)}
${faqToText(p.faq)}
<p><a href="${SITE}/blog">Все статьи блога</a></p></article>`,
  });
}

for (const p of [...SERVICE_PAGES, ...CITY_PAGES]) {
  const prefix = p.kind === "service" ? "/uslugi" : "/goroda";
  const blocks = p.blocks.map((b) => `<h2>${esc(clean(b.h))}</h2><p>${esc(clean(b.p))}</p>`).join("");
  const bullets = p.bullets?.length
    ? `<ul>${p.bullets.map((b) => `<li>${esc(clean(b))}</li>`).join("")}</ul>`
    : "";
  pages.push({
    route: `${prefix}/${p.slug}`,
    title: p.title,
    description: p.description,
    body: `<article><h1>${esc(clean(p.h1))}</h1><p>${esc(clean(p.lead))}</p>
${blocks}${bullets}${faqToText(p.faq)}
<p>Телефон: +7 931 002-82-22</p></article>`,
  });
}

pages.push({
  route: "/blog",
  title: "Блог о работе ресторана с агрегаторами доставки — agregatory.pro",
  description:
    "Разборы для рестораторов: продвижение, экономика, правила сервисов и практика работы с Яндекс Едой и Деливери.",
  body: `<h1>Разборы для рестораторов</h1>
<p>Подробные материалы о работе с агрегаторами доставки: на основе официальной справки сервиса и нашей практики с ресторанами по всей России.</p>
<ul>${BLOG_POSTS.map(
    (p) => `<li><a href="${SITE}/blog/${p.slug}">${esc(clean(p.h1))}</a> — ${esc(clean(p.description))}</li>`,
  ).join("")}</ul>`,
});

pages.push({
  route: "/uslugi",
  title: "Услуги по продвижению ресторанов на агрегаторах — agregatory.pro",
  description:
    "Подключение и ведение ресторанов в Яндекс Еде и Деливери: настройка вендора, контент, акции, продвижение, обучение персонала.",
  body: `<h1>Услуги</h1>
<ul>${SERVICE_PAGES.map(
    (p) => `<li><a href="${SITE}/uslugi/${p.slug}">${esc(clean(p.h1))}</a> — ${esc(clean(p.description))}</li>`,
  ).join("")}</ul>`,
});

pages.push({
  route: "/goroda",
  title: "Продвижение ресторанов по городам России — agregatory.pro",
  description: "Работаем с ресторанами по всей России — от Калининграда до Дальнего Востока.",
  body: `<h1>Города</h1>
<ul>${CITY_PAGES.map(
    (p) => `<li><a href="${SITE}/goroda/${p.slug}">${esc(clean(p.h1))}</a> — ${esc(clean(p.description))}</li>`,
  ).join("")}</ul>`,
});

pages.push({
  route: "/test",
  title: "Тест: проверьте свой проект на агрегаторе за 3 минуты | agregatory.pro",
  description:
    "20 вопросов о работе вашего ресторана на Яндекс Еде и Деливери: рейтинг, ДРР, экономика, контент, отзывы, настройки и отчётность. В конце — оценка проекта и рекомендации.",
  body: `<h1>Проверьте свой проект за 3 минуты</h1>
<p>${QUIZ_QUESTIONS.length} вопросов о работе вашего заведения на агрегаторе: рейтинг, экономика, контент, настройки и команда. В конце — оценка проекта и точки роста, с которых стоит начать.</p>
<h2>О чём спрашиваем</h2>
<ul>${QUIZ_QUESTIONS.map((q) => `<li>${esc(clean(q.question))}${q.note ? ` ${esc(clean(q.note))}` : ""}</li>`).join(
    "",
  )}</ul>
<p>После теста предлагаем бесплатный разбор проекта: смотрим карточку глазами гостя, сравниваем с конкурентами в районе и показываем точки роста.</p>
<p>Телефон: +7 931 002-82-22</p>`,
});

pages.push({
  route: "/partnery",
  title: "Партнёры agregatory.pro — сервисы для ресторанов",
  description: "Сервисы, которые мы советуем клиентам и используем сами в работе с проектами.",
  body: `<h1>С кем работаем</h1>
${PARTNERS.map(
    (p) =>
      `<h2>${esc(clean(p.name))}</h2><p>${esc(clean(p.tagline))}</p><p>${esc(clean(p.description))}</p>` +
      (p.points?.length ? `<ul>${p.points.map((x) => `<li>${esc(clean(x))}</li>`).join("")}</ul>` : ""),
  ).join("")}`,
});


const OG = `${SITE}/og-preview.jpg`;

const render = (p: Page) => {
  const url = `${SITE}${p.route}`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}"/>
<meta name="author" content="agregatory.pro"/>
<link rel="canonical" href="${url}"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<link rel="alternate" type="application/rss+xml" title="Блог agregatory.pro" href="${SITE}/rss.xml"/>
<meta property="og:type" content="${p.route.startsWith("/blog/") ? "article" : "website"}"/>
<meta property="og:site_name" content="agregatory.pro"/>
<meta property="og:locale" content="ru_RU"/>
<meta property="og:title" content="${esc(p.title)}"/>
<meta property="og:description" content="${esc(p.description)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:image" content="${OG}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(p.title)}"/>
<meta name="twitter:description" content="${esc(p.description)}"/>
<meta name="twitter:image" content="${OG}"/>
<meta name="theme-color" content="#FFD600"/>
<style>
  #pp-static{max-width:760px;margin:0 auto;padding:40px 20px;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1a1a1a}
  #pp-static h1{font-size:2em;line-height:1.15;margin:0 0 .4em}
  #pp-static table{border-collapse:collapse;width:100%}
  #pp-static td,#pp-static th{border:1px solid #ddd;padding:6px 10px;text-align:left}
</style>
</head>
<body>
<div id="root"></div>

<div id="pp-static">
${p.body}
</div>

<script>
(function () {
  var s = document.getElementById("pp-static");
  fetch("/?pp-shell=1", { cache: "no-cache" })
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll('link[rel="stylesheet"],link[rel="preconnect"],link[rel="preload"]')
        .forEach(function (l) { document.head.appendChild(l.cloneNode(true)); });
      if (s) s.remove();
      doc.querySelectorAll("script").forEach(function (old) {
        if (old.src && old.src.indexOf("inspector-min") !== -1) return;
        var n = document.createElement("script");
        if (old.type) n.type = old.type;
        if (old.src) n.src = old.src; else n.textContent = old.textContent;
        document.body.appendChild(n);
      });
    })
    .catch(function () {});
})();
</script>
</body>
</html>
`;
};

let count = 0;
for (const p of pages) {
  const dir = path.join(OUT, p.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(p), "utf-8");
  count++;
}

console.log(`Пререндер: ${count} страниц`);