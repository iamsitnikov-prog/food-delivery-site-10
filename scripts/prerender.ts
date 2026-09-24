import fs from "fs";
import path from "path";
import { BLOG_POSTS } from "../src/data/blog-posts";
import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages";
import { PARTNERS } from "../src/data/partners";
import { QUIZ_QUESTIONS } from "../src/data/quiz";
import { CALC_PAGES, VISIBLE_CALC_PAGES } from "../src/data/calculators";
import { CHECKLIST_PAGES } from "../src/data/checklists";
import { READ_CHANNELS } from "../src/data/channels";
import { QUIZZES } from "../src/data/quizzes";
import { getCityCase, CITY_CASES } from "../src/data/city-cases";
import { getChecklistPage } from "../src/data/checklists";

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
  jsonLd?: unknown[];
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
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: clean(p.h1),
        description: clean(p.description),
        datePublished: p.date,
        dateModified: p.date,
        author: { "@type": "Organization", name: "agregatory.pro", url: SITE },
        publisher: {
          "@type": "Organization",
          name: "agregatory.pro",
          logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${p.slug}` },
        inLanguage: "ru-RU",
      },
      ...(p.faq?.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: p.faq.map((f) => ({
                "@type": "Question",
                name: clean(f.q),
                acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
              })),
            },
          ]
        : []),
    ],
    body: `<article><h1>${esc(clean(p.h1))}</h1><p>${esc(clean(p.lead))}</p>
<p>Рубрика: ${esc(clean(p.tag))}. Время чтения: ${esc(p.readTime)}.</p>
${blocksToText(p.blocks)}
${faqToText(p.faq)}
<h2>Пишем о доставке каждый день</h2>
${READ_CHANNELS.map((c) => `<p><a href="${c.href}" rel="noopener">${esc(clean(c.label))}</a> — ${esc(clean(c.short))}</p>`).join("")}
<p><a href="${SITE}/blog">Все статьи блога</a></p></article>`,
  });
}

for (const p of [...SERVICE_PAGES, ...CITY_PAGES]) {
  const prefix = p.kind === "service" ? "/uslugi" : "/goroda";
  const blocks = p.blocks.map((b) => `<h2>${esc(clean(b.h))}</h2><p>${esc(clean(b.p))}</p>`).join("");
  const bullets = p.bullets?.length
    ? `<ul>${p.bullets.map((b) => `<li>${esc(clean(b))}</li>`).join("")}</ul>`
    : "";
  const cCase = p.kind === "city" ? getCityCase(p.slug) : undefined;
  const cl = cCase ? getChecklistPage(cCase.checklist) : undefined;
  const caseChecklist = cl
    ? `<p>Сделайте то же самое у себя: <a href="/chek-listy/${cl.slug}">чек-лист «${esc(clean(cl.navLabel))}»</a> — ${esc(clean(cl.lead))}</p>`
    : "";
  const caseHtml = cCase
    ? `<h2>Наш кейс в ${esc(clean(cCase.cityIn))}</h2>
<p><b>${esc(clean(cCase.place))}</b> — ${esc(clean(cCase.kind))}, ${esc(clean(cCase.period))}.</p>
<p>${esc(clean(cCase.problem))}</p>
<h3>Что сделали</h3><ul>${cCase.actions.map((a) => `<li>${esc(clean(a))}</li>`).join("")}</ul>
<h3>Результат</h3><ul>${cCase.metrics
        .map(
          (m) =>
            `<li>${esc(clean(m.label))}: ${esc(clean(m.value))}${m.note ? ` (${esc(clean(m.note))})` : ""}</li>`,
        )
        .join("")}</ul>
<p>${esc(clean(cCase.result))}</p>${caseChecklist}`
    : "";

  pages.push({
    route: `${prefix}/${p.slug}`,
    title: p.title,
    description: p.description,
    jsonLd: p.faq?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: p.faq.map((f) => ({
              "@type": "Question",
              name: clean(f.q),
              acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
            })),
          },
        ]
      : undefined,
    body: `<article><h1>${esc(clean(p.h1))}</h1><p>${esc(clean(p.lead))}</p>
${blocks}${caseHtml}${bullets}${faqToText(p.faq)}
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
  route: "/testy",
  title: "Тесты для ресторанов на агрегаторах доставки | agregatory.pro",
  description:
    "Бесплатные тесты: экспресс-аудит заведения, знание кабинета Яндекс Еды, экономика доставки, качество и рейтинг, требования 289-ФЗ. С разбором ответов.",
  body: `<h1>Тесты о работе с агрегаторами</h1>
<p>Проверьте своё заведение или собственные знания. Все тесты бесплатны, регистрация не нужна.</p>
<ul>${QUIZZES.map(
    (q) =>
      `<li><a href="/testy/${q.slug}">${esc(clean(q.navLabel))}</a> — ${esc(clean(q.lead))}</li>`,
  ).join("")}</ul>
<p>Телефон: +7 931 002-82-22</p>`,
});

for (const q of QUIZZES) {
  pages.push({
    route: `/testy/${q.slug}`,
    title: q.title,
    description: q.description,
    body: `<h1>${esc(clean(q.h1))}</h1>
<p>${esc(clean(q.intro))}</p>
<p>Вопросов: ${q.questions.length}. Время прохождения: ${esc(clean(q.minutes))}.</p>
<h2>О чём спрашиваем</h2>
<ul>${q.questions
      .map((x) => `<li>${esc(clean(x.question))}${x.note ? ` ${esc(clean(x.note))}` : ""}</li>`)
      .join("")}</ul>
<p><a href="/testy">Все тесты</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
  });
}

pages.push({
  route: "/kalkulyatory",
  title: "Калькуляторы для ресторанов на агрегаторах | agregatory.pro",
  description:
    "Бесплатные калькуляторы для доставки: рентабельность заказа, ДРР, порог по НДС и окупаемость канала. Введите свои цифры и получите расчёт сразу.",
  body: `<h1>Калькуляторы экономики доставки</h1>
<p>Введите свои цифры один раз — увидите рентабельность заказа, ДРР, окупаемость канала и порог по НДС. Бесплатно, без регистрации.</p>
<ul>${VISIBLE_CALC_PAGES.map(
    (c) =>
      `<li><a href="/kalkulyatory/${c.slug}">${esc(clean(c.navLabel))}</a> — ${esc(clean(c.lead))}</li>`,
  ).join("")}</ul>
<p>Телефон: +7 931 002-82-22</p>`,
});

for (const c of CALC_PAGES) {
  pages.push({
    route: `/kalkulyatory/${c.slug}`,
    title: c.title,
    description: c.description,
    body: `<h1>${esc(clean(c.h1))}</h1>
<p>${esc(clean(c.lead))}</p>
${c.intro.map((t) => `<p>${esc(clean(t))}</p>`).join("")}
<h2>Частые вопросы</h2>
${c.faq.map((f) => `<h3>${esc(clean(f.q))}</h3><p>${esc(clean(f.a))}</p>`).join("")}
<h2>Другие калькуляторы</h2>
<ul><li><a href="/kalkulyatory">Все калькуляторы</a></li>${VISIBLE_CALC_PAGES.filter(
      (o) => o.slug !== c.slug,
    )
      .map((o) => `<li><a href="/kalkulyatory/${o.slug}">${esc(clean(o.navLabel))}</a></li>`)
      .join("")}</ul>
<p>Телефон: +7 931 002-82-22</p>`,
  });
}

pages.push({
  route: "/pochitat",
  title: "Почитать о доставке: наши каналы и блог | agregatory.pro",
  description:
    "Telegram-каналы и Дзен о работе ресторанов с агрегаторами: разборы обновлений, механики акций, рейтинг и отзывы, экономика доставки.",
  body: `<h1>Почитать о доставке</h1>
<p>Пишем о том, как устроены агрегаторы изнутри: обновления сервисов, механики акций, работа с рейтингом и честная экономика доставки.</p>
${READ_CHANNELS.map(
    (c) =>
      `<h2>${esc(clean(c.label))} — ${esc(clean(c.handle))}</h2><p>${esc(clean(c.author))}. ${esc(clean(c.description))}</p><p><a href="${c.href}" rel="noopener">${esc(clean(c.label))}</a></p>`,
  ).join("")}
<p><a href="/blog">Блог</a> · <a href="/kalkulyatory">Калькуляторы</a> · <a href="/chek-listy">Чек-листы</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
});

pages.push({
  route: "/chek-listy",
  title: "Чек-листы для ресторанов на агрегаторах | agregatory.pro",
  description:
    "Бесплатные чек-листы для доставки: запуск на агрегаторе и проверка карточки ресторана. Отмечайте пункты — прогресс сохраняется.",
  body: `<h1>Чек-листы для доставки</h1>
<p>Пошаговые списки без воды: что проверить при запуске и что чинить, если заказы просели.</p>
<ul>${CHECKLIST_PAGES.map(
    (c) =>
      `<li><a href="/chek-listy/${c.slug}">${esc(clean(c.navLabel))}</a> — ${esc(clean(c.lead))}</li>`,
  ).join("")}</ul>
<p>Телефон: +7 931 002-82-22</p>`,
});

const clCases = (slug: string) => {
  const list = Object.entries(CITY_CASES).filter(([, x]) => x.checklist === slug).slice(0, 3);
  if (!list.length) return "";
  return `<h2>Это работает на практике</h2><ul>${list
    .map(
      ([citySlug, x]) =>
        `<li><a href="/goroda/${citySlug}">${esc(clean(x.place))}</a>, ${esc(clean(x.cityIn))} — ${x.metrics
          .slice(0, 2)
          .map((m) => `${esc(clean(m.label))}: ${esc(clean(m.value))}`)
          .join(", ")}</li>`,
    )
    .join("")}</ul>`;
};

for (const c of CHECKLIST_PAGES) {
  pages.push({
    route: `/chek-listy/${c.slug}`,
    title: c.title,
    description: c.description,
    jsonLd: c.faq?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.faq.map((f) => ({
              "@type": "Question",
              name: clean(f.q),
              acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
            })),
          },
        ]
      : undefined,
    body: `<h1>${esc(clean(c.h1))}</h1>
<p>${esc(clean(c.lead))}</p>
${c.intro.map((t) => `<p>${esc(clean(t))}</p>`).join("")}
${c.groups
  .map(
    (g) =>
      `<h2>${esc(clean(g.title))}</h2><ul>${g.items
        .map((it) => `<li>${esc(clean(it.text))}${it.hint ? ` — ${esc(clean(it.hint))}` : ""}</li>`)
        .join("")}</ul>`,
  )
  .join("")}
<h2>Частые вопросы</h2>
${c.faq.map((f) => `<h3>${esc(clean(f.q))}</h3><p>${esc(clean(f.a))}</p>`).join("")}
${clCases(c.slug)}
<h2>Пишем о доставке каждый день</h2>
${READ_CHANNELS.map((c) => `<p><a href="${c.href}" rel="noopener">${esc(clean(c.label))}</a> — ${esc(clean(c.short))}</p>`).join("")}
<p><a href="/chek-listy">Все чек-листы</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
  });
}

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

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "agregatory.pro",
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  description: "Продвижение ресторанов на агрегаторах доставки",
  telephone: "+7 931 002-82-22",
  areaServed: "RU",
  sameAs: [
    "https://t.me/vnutri_edy_channel",
    "https://t.me/Kovalchuk_dostavka",
    "https://dzen.ru/id/669050347cf47c302ba6bd98",
  ],
};

const crumbs = (route: string, title: string) => {
  const parts = route.split("/").filter(Boolean);
  const items: unknown[] = [{ "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` }];
  const NAMES: Record<string, string> = {
    blog: "Блог",
    uslugi: "Услуги",
    goroda: "Города",
    kalkulyatory: "Калькуляторы",
    "chek-listy": "Чек-листы",
    testy: "Тесты",
    pochitat: "Почитать",
    partnery: "Партнёры",
  };
  let acc = "";
  parts.forEach((seg, i) => {
    acc += `/${seg}`;
    const last = i === parts.length - 1;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: last ? title : NAMES[seg] || seg,
      item: `${SITE}${acc}`,
    });
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
};

const render = (p: Page) => {
  const url = `${SITE}${p.route}`;
  const ld: unknown[] = [];
  if (p.route === "/") ld.push(ORG);
  else ld.push(crumbs(p.route, p.title.split("|")[0].split("—")[0].trim()));
  if (p.jsonLd?.length) ld.push(...p.jsonLd);
  const ldTags = ld
    .map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`)
    .join("\n");

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
${ldTags}
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