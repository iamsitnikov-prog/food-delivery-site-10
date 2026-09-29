import fs from "fs";
import path from "path";
import { BLOG_POSTS as ALL_POSTS } from "../src/data/blog-posts";

import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages";
import { PARTNERS } from "../src/data/partners";
import { QUIZ_QUESTIONS } from "../src/data/quiz";
import { CALC_PAGES, VISIBLE_CALC_PAGES } from "../src/data/calculators";
import { CHECKLIST_PAGES } from "../src/data/checklists";
import { READ_CHANNELS } from "../src/data/channels";
import { QUIZZES } from "../src/data/quizzes";
import { getCityCase, CITY_CASES } from "../src/data/city-cases";
import { getChecklistPage } from "../src/data/checklists";
import { GLOSSARY, GLOSSARY_LETTERS } from "../src/data/glossary";
import { termDescription, termTitle } from "../src/lib/term-seo";
import { getServiceResources } from "../src/data/service-resources";
import { AGGREGATORS, SCENARIOS, CONCLUSIONS } from "../src/data/comparison";

const todayISO = () => new Date().toISOString().slice(0, 10);
const BLOG_POSTS = ALL_POSTS.filter((p) => !p.date || p.date <= todayISO());

const SITE = "https://agregatory.pro";
// Пишем в dist: Vite копирует public в dist ДО запуска пререндера,
// поэтому запись в public не попадала в сборку и сайт получал старые страницы.
// Если dist ещё нет (ручной запуск), падаем обратно на public.
const ROOT = path.resolve(process.cwd());

// Пишем в public, а не в dist.
//
// Почему: платформа деплоя собирает проект у себя, и хуки Vite там не всегда
// доходят до записи файлов. А вот содержимое public попадает в сборку всегда —
// это проверено: sitemap.xml из public доезжал до боевого сайта.
// Поэтому готовые страницы коммитятся в репозиторий вместе с кодом и
// гарантированно оказываются на сервере, независимо от того, как именно
// платформа запускает сборку.
//
// Vite копирует public в dist на старте сборки, так что локально всё сходится.
const OUT = process.env.PRERENDER_OUT_DIR || path.join(ROOT, "public");

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clean = (s: string) => s.replace(/\u00a0/g, " ").trim();

type Page = {
  route: string;
  /** Если страница — дубль, каноникал ведёт сюда. */
  canonical?: string;
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
<p><a href="${SITE}/blog">Все статьи блога</a> · <a href="${SITE}/slovar">Глоссарий доставки</a> · <a href="${SITE}/sravnenie-agregatorov">Сравнение агрегаторов</a> · <a href="${SITE}/kalkulyatory">Калькуляторы</a></p></article>`,
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
<h2>Полезное по теме</h2>
<ul>${getServiceResources(p.slug, p.kind)
      .map(
        (r) =>
          `<li><a href="${r.to}">${esc(clean(r.label))}</a> — ${esc(clean(r.note))}</li>`,
      )
      .join("")}</ul>
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
  canonical: "/testy/audit",
  title: "Тест: проверьте свой проект на агрегаторе | agregatory.pro",
  description:
    "20 вопросов о работе ресторана на агрегаторах: рейтинг, ДРР, экономика, контент и отчётность. В конце — оценка проекта.",
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
  title: "Калькуляторы экономики доставки | agregatory.pro",
  description:
    "Калькуляторы доставки: рентабельность заказа, ДРР, порог по НДС и окупаемость канала. Расчёт на ваших цифрах, бесплатно.",
  body: `<h1>Калькуляторы и сравнения для доставки</h1>
<p>Введите свои цифры один раз — увидите рентабельность заказа, ДРР, окупаемость канала и порог по НДС. Здесь же сравнения агрегаторов и конструкторов доставки. Бесплатно, без регистрации.</p>
<ul>${VISIBLE_CALC_PAGES.map(
    (c) =>
      `<li><a href="/kalkulyatory/${c.slug}">${esc(clean(c.navLabel))}</a> — ${esc(clean(c.lead))}</li>`,
  ).join("")}</ul>
<h2>Сравнения сервисов</h2>
<ul><li><a href="/kalkulyatory/konstruktory-dostavki">Конструкторы доставки</a> — Sellkit, STARTER, Смартомато и ФудПикассо: стоимость и окупаемость своего канала</li><li><a href="/sravnenie-agregatorov">Сравнение агрегаторов</a> — Яндекс Еда, Купер и Чиббис: комиссии, охват и прибыль</li></ul>
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
  route: "/razbor-otchetov",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Как проверить отчёт агрегатора",
      inLanguage: "ru-RU",
      url: `${SITE}/razbor-otchetov`,
      step: [
        {
          "@type": "HowToStep",
          name: "Скачать отчёт из кабинета",
          text: "Выгрузите из личного кабинета сервиса отчёт о платёжных поручениях или отчёт об исполнении поручения без изменений, не пересохраняя файл.",
        },
        {
          "@type": "HowToStep",
          name: "Посчитать реальные удержания",
          text: "Просуммируйте все удержания: вознаграждение за услуги, маркетинговые услуги, абонентскую плату, буст и удержания по оферте. Разделите на валовый оборот и получите фактическую нагрузку.",
        },
        {
          "@type": "HowToStep",
          name: "Сверить с поступлениями",
          text: "Сумма всех строк отчёта должна совпасть с суммой платёжных поручений до копейки.",
        },
        {
          "@type": "HowToStep",
          name: "Проверить сальдо",
          text: "Входящее сальдо плюс подлежит к перечислению минус фактически перечислено должно дать исходящее сальдо на конец периода.",
        },
      ],
    },
  ],
  title:
    "Разбор отчётов агрегаторов доставки | agregatory.pro",
  description:
    "Как читать отчёты сервиса доставки. Загрузите файл — покажем фактическую нагрузку на оборот. Файл не покидает браузер.",
  body: `<h1>Разбор отчётов агрегаторов</h1>
<p>Загрузите отчёт из личного кабинета сервиса — покажем фактическую нагрузку на оборот, состав удержаний и позиции, по которым стоит уточнить основание. Файл не уходит на сервер: весь разбор происходит в браузере на вашем устройстве. Мы не храним загруженные документы и не видим их содержимое. Если файла нет под рукой, на странице есть демонстрационный пример на обезличенных данных.</p>
<h2>Отчёт по платёжным поручениям</h2>
<p>Приходит еженедельно. Одна строка — одна операция, поэтому у одного заказа строк бывает четыре и больше. Колонка «Оплата по заказу» показывает платёж гостя. Ниже идут удержания: «Стоимость услуг за заказ» — вознаграждение сервиса по договору, «Маркетинговые услуги Продвижение» — платное продвижение, «Стоимость услуги Подписка Стандарт/Бизнес» — переменная часть абонентской платы, «Стоимость услуги Буст» — повышение позиции в выдаче.</p>
<p>Главная проверка: сложите все суммы транзакций и сравните с суммой уникальных платёжных поручений из колонок «Платежное поручение» и «Сумма п/п». В исправном отчёте разница равна нулю до копейки.</p>
<p>Пример для наглядности: при обороте 448 754 рубля по 251 заказу на счёт пришло 254 124 рубля. Вознаграждение за услуги составило 127 715 рублей, маркетинговые услуги — 56 221 рубль, абонентская плата — 8 975 рублей. Итоговая нагрузка на оборот — 43,4 процента при ставке 28,5 процента по договору. Цифры взяты из одного отчёта и приведены как иллюстрация: у каждого партнёра свой набор подключённых услуг и своя итоговая нагрузка.</p>
<h2>Отчёт об исполнении поручения</h2>
<p>Единственный документ, который ресторан подписывает. Раздел 3 содержит движение денег: входящее сальдо на начало периода, итого сумма подлежащая перечислению, подлежит удержанию, подлежит к перечислению, фактически перечислено и исходящее сальдо на конец периода.</p>
<p>Частый вопрос: строки «Подлежит к перечислению» и «Фактически перечислено» обычно не совпадают. Это не недоплата — так устроена механика расчётов: разница формирует исходящее сальдо и приходит в следующем периоде. Проверяется формулой: входящее сальдо плюс подлежит к перечислению минус фактически перечислено равно исходящему сальдо.</p>
<p>Вторая проверка: итого поступлений минус удержания должно равняться строке «Подлежит к перечислению». Третья: строка 3.1 «Стоимость услуг Яндекс.Еда» обязана совпадать с суммой актов, перечисленных выше в этом же документе. Подписывая отчёт, вы соглашаетесь со всеми удержаниями — после истечения срока из договора претензии не принимаются.</p>
<h2>Информационный отчёт по заказам за месяц</h2>
<p>Сводка за месяц, одна строка — один заказ. Колонка «Процент стоимости услуг» указана без НДС, а удерживают с НДС, поэтому фактическое списание всегда больше. При ставке 15 процентов от заказа на 3 830 рублей комиссия без НДС составила бы 574,50 рубля, а списывается 700,89 рубля.</p>
<p>Важная особенность: итоговые суммы в шапке файла сделаны формулами. Пока Excel их не пересчитает, вы видите нули и можете решить, что отчёт пустой. Настоящие цифры лежат в строках заказов ниже.</p>
<h2>Расшифровка к отчёту</h2>
<p>Пятьдесят колонок и три листа: сама расшифровка, CPA-продвижение и штрафы. У обычного ресторана большинство колонок заполнены нулями — они нужны для программ, в которых вы не участвуете. Смотреть стоит на размер стоимости услуг, вознаграждение за услуги CPA-маркетинга, удержания по оферте пункт 14.7 и лист со штрафами.</p>
<p>Удержания по пункту 14.7 оферты — это компенсация гостю за отсутствующую позицию или недовложение за счёт партнёра. Основание можно запросить через поддержку: если вина партнёра не подтверждается, удержание снимают, и в следующем отчёте появляется строка возврата.</p>
<h2>Почему фактическая нагрузка выше ставки в договоре</h2>
<p>Вознаграждение за услуги — только одна из строк удержаний. Рядом идут маркетинговые услуги, абонентская плата за тариф, буст, CPA-маркетинг, компенсации гостям и удержания по офертам. Это отдельные услуги по разным основаниям, и большинство из них партнёр подключает добровольно. Но с точки зрения расчётного счёта разницы нет: все они уменьшают поступления, поэтому итоговую нагрузку полезно знать.</p>
<p><a href="/kalkulyatory/rentabelnost-zakaza">Калькулятор рентабельности</a> · <a href="/sravnenie-agregatorov">Сравнение игроков</a> · <a href="/slovar">Глоссарий доставки</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
});

pages.push({
  route: "/slovar",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Глоссарий доставки",
      inLanguage: "ru-RU",
      url: `${SITE}/slovar`,
      hasDefinedTerm: GLOSSARY.map((g) => ({
        "@type": "DefinedTerm",
        "@id": `${SITE}/slovar#${g.slug}`,
        name: clean(g.term),
        description: clean(g.short),
        inDefinedTermSet: `${SITE}/slovar`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: GLOSSARY.map((g) => ({
        "@type": "Question",
        name: `Что такое ${clean(g.term)}?`,
        acceptedAnswer: { "@type": "Answer", text: clean(g.full) },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Термины доставки",
      numberOfItems: GLOSSARY.length,
      itemListElement: GLOSSARY.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: clean(g.term),
        url: `${SITE}/slovar/${g.slug}`,
      })),
    },
  ],
  title: "Глоссарий доставки: 146 терминов простыми словами",
  description: `ДРР, ROMI, GMV, юнит-экономика, фудкост, SLA — ${GLOSSARY.length} термин доставки простым языком с формулами, примерами и навигацией по буквам.`,
  body: `<h1>Глоссарий доставки</h1>
<p>${GLOSSARY.length} понятий из кабинета сервиса, отчётов и разговоров с менеджерами — простым языком, с формулами, примерами и связями между терминами. Термины сгруппированы по темам: маркетинг и воронка, юнит-экономика, финансы и отчётность, операционка, свой канал и CRM.</p>
<p>Навигация по буквам: ${GLOSSARY_LETTERS.map((l) => `<a href="/slovar#letter-${encodeURIComponent(l)}">${esc(l)}</a>`).join(" · ")}</p>
${GLOSSARY.map(
    (t) =>
      `<h2><a href="/slovar/${t.slug}">${esc(clean(t.term))}</a></h2><p>${esc(clean(t.short))}</p><p>${esc(clean(t.full))}</p>${
        t.formula ? `<p>Формула: ${esc(clean(t.formula))}</p>` : ""
      }${t.example ? `<p>Пример. ${esc(clean(t.example))}</p>` : ""}${
        t.see && t.see.length
          ? `<p>Смотрите также: ${t.see
              .map((s) => GLOSSARY.find((g) => g.slug === s))
              .filter(Boolean)
              .map((g) => `<a href="/slovar#${g!.slug}">${esc(clean(g!.term))}</a>`)
              .join(" · ")}</p>`
          : ""
      }${
        t.links && t.links.length
          ? `<p>${t.links
              .map((l) => `<a href="${l.to}">${esc(clean(l.label))}</a>`)
              .join(" · ")}</p>`
          : ""
      }`,
  ).join("")}
<p><a href="/kalkulyatory">Калькуляторы</a> · <a href="/sravnenie-agregatorov">Сравнение агрегаторов</a> · <a href="/blog">Блог</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
});

for (const term of GLOSSARY) {
  const related = (term.see ?? [])
    .map((s) => GLOSSARY.find((g) => g.slug === s))
    .filter((g): g is (typeof GLOSSARY)[number] => Boolean(g));
  const sameGroup = GLOSSARY.filter(
    (g) => g.group === term.group && g.slug !== term.slug,
  ).slice(0, 6);

  pages.push({
    route: `/slovar/${term.slug}`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Глоссарий доставки",
            item: `${SITE}/slovar`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: clean(term.term),
            item: `${SITE}/slovar/${term.slug}`,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "@id": `${SITE}/slovar/${term.slug}`,
        name: clean(term.term),
        description: clean(term.short),
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "Глоссарий доставки",
          url: `${SITE}/slovar`,
        },
        inLanguage: "ru-RU",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Что такое ${clean(term.term)}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${clean(term.short)} ${clean(term.full)}`,
            },
          },
          ...(term.formula
            ? [
                {
                  "@type": "Question",
                  name: `Как считать ${clean(term.term)}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${clean(term.formula)}${
                      term.example ? `. Пример: ${clean(term.example)}` : ""
                    }`,
                  },
                },
              ]
            : []),
          ...(term.faq ?? []).map((f) => ({
            "@type": "Question",
            name: clean(f.q),
            acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
          })),
        ],
      },
    ],
    title: termTitle({ term: clean(term.term) }),
    description: termDescription({
      term: clean(term.term),
      short: clean(term.short),
      formula: term.formula ? clean(term.formula) : undefined,
    }),
    body: `<h1>${esc(clean(term.term))}</h1>
<p>${esc(clean(term.short))}</p>
<h2>Что это значит</h2>
<p>${esc(clean(term.full))}</p>${
      term.formula
        ? `\n<h2>Как считать</h2>\n<p>${esc(clean(term.formula))}</p>`
        : ""
    }${term.example ? `\n<h2>Пример</h2>\n<p>${esc(clean(term.example))}</p>` : ""}${
      term.mistake
        ? `\n<h2>Типичная ошибка</h2>\n<p>${esc(clean(term.mistake))}</p>`
        : ""
    }${
      term.sections?.length
        ? "\n" +
          term.sections
            .map(
              (s) =>
                `<h2>${esc(clean(s.title))}</h2>\n<p>${esc(clean(s.body))}</p>`,
            )
            .join("\n")
        : ""
    }${
      term.faq?.length
        ? `\n<h2>Частые вопросы</h2>\n` +
          term.faq
            .map(
              (f) => `<h3>${esc(clean(f.q))}</h3>\n<p>${esc(clean(f.a))}</p>`,
            )
            .join("\n")
        : ""
    }${
      term.links && term.links.length
        ? `\n<h2>Применить на практике</h2>\n<p>${term.links
            .map((l) => `<a href="${l.to}">${esc(clean(l.label))}</a>`)
            .join(" · ")}</p>`
        : ""
    }${
      related.length
        ? `\n<h2>Связанные термины</h2>\n<ul>${related
            .map(
              (r) =>
                `<li><a href="/slovar/${r.slug}">${esc(clean(r.term))}</a> — ${esc(
                  clean(r.short),
                )}</li>`,
            )
            .join("")}</ul>`
        : ""
    }${
      sameGroup.length
        ? `\n<p>Рядом по теме «${esc(clean(term.group))}»: ${sameGroup
            .map((g) => `<a href="/slovar/${g.slug}">${esc(clean(g.term))}</a>`)
            .join(" · ")}</p>`
        : ""
    }
<p><a href="/slovar">Весь глоссарий доставки</a> · <a href="/kalkulyatory">Калькуляторы</a> · <a href="/razbor-otchetov">Разбор отчётов</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
  });
}

pages.push({
  route: "/kalkulyatory/konstruktory-dostavki",
  title: "Сравнение конструкторов доставки для ресторана | agregatory.pro",
  description:
    "Sellkit, STARTER, Смартомато и ФудПикассо: стоимость, возможности и окупаемость. Сколько сэкономите со своим приложением.",
  body: `<h1>Сравнение конструкторов доставки</h1>
<p>Sellkit, STARTER, Смартомато и ФудПикассо делают вам свой сайт заказа и приложение. Посчитайте, сколько вы сэкономите на комиссии и с какого объёма это окупается.</p>
<p>Собственный канал заказов решает одну задачу — перестать платить процент с гостей, которые и так знают ваше заведение. Агрегатор берёт комиссию с каждого заказа независимо от того, нашёл он вам этого клиента или тот пришёл сам. Конструктор меняет модель: вы платите фиксированную сумму, и она не растёт вместе с оборотом.</p>
<p>Но есть обратная сторона: свой сайт и приложение не приводят новых гостей — их нужно привести туда самостоятельно. Агрегатор остаётся витриной для первого знакомства, а свой канал подхватывает повторные заказы.</p>
<p>Точка входа считается просто: плата за платформу делится на комиссию, которую вы платите с одного заказа. Получится число прямых заказов в месяц, после которого канал начинает приносить деньги. Обычно это один-два заказа в день.</p>
<h2>Что сравниваем</h2>
<ul><li>STARTER — приложение, сайт и программа лояльности в одной системе</li><li>Sellkit — платформа прямых заказов для сетей</li><li>Смартомато — самый дешёвый вход на рынке</li><li>ФудПикассо — конструктор сайта доставки с фотобанком</li></ul>
<h2>Частые вопросы</h2>
<h3>Что такое конструктор доставки и зачем он нужен?</h3><p>Это платформа, которая делает вам собственный сайт заказа и мобильное приложение под вашим брендом. Гость заказывает напрямую у вас, а не через агрегатор, поэтому комиссия с заказа не удерживается — вы платите платформе фиксированную сумму в месяц.</p>
<h3>Когда собственный канал начинает окупаться?</h3><p>Месячная плата за платформу делится на среднюю комиссию с одного заказа. При чеке 1200 рублей и комиссии 30% агрегатор забирает около 360 рублей с заказа, значит платформа за 12000 рублей окупается примерно на 33 прямых заказах в месяц — это один заказ в день.</p>
<h3>Можно ли полностью отказаться от агрегаторов?</h3><p>На практике так почти никто не делает. Агрегатор — это витрина, на которой вас находят новые гости, а собственное приложение удерживает тех, кто уже пробовал вашу кухню.</p>
<p><a href="/kalkulyatory">Все калькуляторы и сравнения</a> · <a href="/sravnenie-agregatorov">Сравнение агрегаторов</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
});

pages.push({
  route: "/sravnenie-agregatorov",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Игроки рынка доставки для ресторанов",
      itemListElement: AGGREGATORS.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: clean(a.name),
        description: clean(a.tagline),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: SCENARIOS.map((s) => ({
        "@type": "Question",
        name: clean(s.title),
        acceptedAnswer: { "@type": "Answer", text: `${clean(s.situation)} ${clean(s.verdict)}` },
      })),
    },
  ],
  title: "Яндекс Еда, Купер или Чиббис: что выгоднее | agregatory.pro",
  description:
    "Сравнение агрегаторов доставки для ресторанов: комиссии, география, курьеры, сроки подключения. Разбор по сценариям и выводы, какой сервис выбрать.",
  body: `<h1>Яндекс Еда, Купер или Чиббис: что выгоднее ресторану</h1>
<p>Сравнили три агрегатора по комиссиям, географии и логистике. Только цифры, сценарии и честные выводы, кому что подходит.</p>
${AGGREGATORS.map(
    (a) =>
      `<h2>${esc(clean(a.name))} — ${esc(clean(a.tagline))}</h2>
<p>Комиссия с курьерами сервиса: ${esc(clean(a.commissionCourier))}. Комиссия со своими курьерами: ${esc(clean(a.commissionSelf))}.</p>
<p>Курьеры: ${esc(clean(a.couriers))}. География: ${esc(clean(a.geography))}.</p>
<p>Подключение: ${esc(clean(a.launch))}. Выплаты: ${esc(clean(a.payouts))}. Продвижение: ${esc(clean(a.promo))}.</p>
<h3>Сильные стороны</h3><ul>${a.strong.map((s) => `<li>${esc(clean(s))}</li>`).join("")}</ul>
<h3>Слабые стороны</h3><ul>${a.weak.map((s) => `<li>${esc(clean(s))}</li>`).join("")}</ul>
<p>Кому подходит: ${esc(clean(a.bestFor))}</p>`,
  ).join("")}
<h2>Что выбрать в вашем случае</h2>
${SCENARIOS.map(
    (s) =>
      `<h3>${esc(clean(s.title))}</h3><p>${esc(clean(s.situation))}</p><p>${esc(clean(s.verdict))}</p><p>Выбор: ${esc(clean(s.winner))}</p>`,
  ).join("")}
<h2>Выводы по агрегаторам</h2>
${CONCLUSIONS.map((c) => `<h3>${esc(clean(c.h))}</h3><p>${esc(clean(c.p))}</p>`).join("")}
<h2>Конструкторы доставки: свой сайт и приложение</h2>
<p>Вторая группа игроков решает другую задачу. Конструктор не приводит новых гостей — он даёт собственный канал заказов без комиссии: гость заказывает напрямую у вас, а платформе вы платите фиксированную сумму в месяц.</p>
<h3>STARTER — приложение, сайт и лояльность в одной системе</h3>
<p>Ориентир по цене: от 15 000 рублей в месяц, тариф обсуждается индивидуально. Своё приложение и сайт заказа под ваш бренд, CRM с RFM-анализом и рассылками по сегментам, программа лояльности и геймификация, безлимитные SMS-авторизации и push-уведомления, интеграции с iiko и r_keeper, поддержка круглосуточно. Подходит тем, кто хочет не просто сайт заказа, а систему удержания гостей.</p>
<h3>Sellkit — платформа прямых заказов для сетей</h3>
<p>Ориентир по цене: от 11 880 рублей в месяц. Сайт и мобильное приложение заказа, маркетинговые инструменты и аналитика продаж, интеграции с кассовыми системами. Подходит сетям с несколькими точками.</p>
<h3>Смартомато — самый дешёвый вход на рынке</h3>
<p>Ориентир по цене: от 2 400 рублей в месяц, версия с приложением около 8 400 рублей. Сайт заказа с корзиной и оплатой, тарифная линейка под разный размер бизнеса. Мобильное приложение только в старших тарифах, инструменты лояльности скромнее, чем у лидеров.</p>
<h3>ФудПикассо — конструктор сайта доставки с фотобанком</h3>
<p>Ориентир по цене: от 4 900 рублей в месяц. Быстрый запуск сайта доставки без разработчиков, готовые шаблоны и банк фотографий блюд. Акцент на сайте, приложение слабее конкурентов, меньше инструментов удержания и аналитики.</p>
<h3>Дешевле не значит выгоднее</h3>
<p>Разница между платформами в подписке — несколько тысяч рублей в месяц. Разница в результате измеряется процентом гостей, которые вернулись. Платформа без приложения и лояльности даёт сайт, на который никто не заходит второй раз. Считать нужно не стоимость подписки, а стоимость удержанного гостя.</p>
<h3>Когда запускать свой канал</h3>
<p>Плата за платформу делится на комиссию с одного заказа. При чеке 1200 рублей и комиссии 30 процентов агрегатор забирает около 360 рублей с заказа, значит платформа за 12 000 рублей окупается примерно на 33 прямых заказах в месяц — это один заказ в день.</p>
<p><a href="/kalkulyatory/rentabelnost-zakaza">Калькулятор рентабельности</a> · <a href="/kalkulyatory/model-dostavki">Модели доставки</a> · <a href="/slovar">Словарь терминов</a></p>
<p>Телефон: +7 931 002-82-22</p>`,
});

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
  route: "/privacy",
  title: "Политика обработки персональных данных — agregatory.pro",
  description:
    "Порядок обработки и защиты персональных данных пользователей сайта agregatory.pro: какие данные собираем, цели обработки, права пользователя и контакты операторов.",
  body: `<h1>Политика обработки персональных данных</h1>
<p>Документ описывает, какие персональные данные собирает сайт agregatory.pro, с какими целями они обрабатываются, как хранятся и защищаются, а также какие права есть у пользователя.</p>
<p><a href="/">Главная</a> · <a href="/uslugi">Услуги</a> · <a href="/blog">Блог</a></p>
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
    jsonLd: [
      ...(c.faq?.length
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
        : []),
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: clean(c.h1),
        description: clean(c.description),
        totalTime: "PT7D",
        inLanguage: "ru-RU",
        url: `${SITE}/chek-listy/${c.slug}`,
        step: c.groups.map((g, gi) => ({
          "@type": "HowToSection",
          position: gi + 1,
          name: clean(g.title),
          itemListElement: g.items.map((it, ii) => ({
            "@type": "HowToStep",
            position: ii + 1,
            name: clean(it.text),
            text: it.hint ? `${clean(it.text)}. ${clean(it.hint)}` : clean(it.text),
            url: `${SITE}/chek-listy/${c.slug}#${gi + 1}-${ii + 1}`,
          })),
        })),
      },
    ],
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


const OG = `${SITE}/og-preview.jpg?v=3`;

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
    slovar: "Глоссарий",
    "sravnenie-agregatorov": "Сравнение агрегаторов",
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
  const canonical = p.canonical ? `${SITE}${p.canonical}` : url;
  const ld: unknown[] = [];
  if (p.route === "/") ld.push(ORG);
  else {
    ld.push(crumbs(p.route, p.title.split("|")[0].split("—")[0].trim()));
    ld.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: clean(p.title),
      description: clean(p.description),
      inLanguage: "ru-RU",
      isPartOf: { "@type": "WebSite", name: "agregatory.pro", url: `${SITE}/` },
      publisher: { "@type": "Organization", name: "agregatory.pro", url: `${SITE}/` },
    });
  }
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
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
<meta name="google-site-verification" content="6qSlSsAxE47iQkzbcwZK3msN0JIrBGB_DI4po2djsfI"/>
<meta name="yandex" content="index, follow"/>
<link rel="canonical" href="${canonical}"/>
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

// 404: отдельный файл для хостинга. Каноникал не ставим, страницу закрываем от индексации.
const notFoundHtml = render({
  route: "/404",
  title: "Страница не найдена — agregatory.pro",
  description:
    "Такой страницы нет. Посмотрите услуги, блог, калькуляторы и чек-листы для работы ресторана с агрегаторами доставки.",
  body: `<h1>Страница не найдена</h1>
<p>Возможно, адрес набран с ошибкой или материал переехал. Вот основные разделы сайта:</p>
<ul>
<li><a href="/uslugi">Услуги</a> — подключение, настройка и продвижение на агрегаторах</li>
<li><a href="/goroda">Города</a> — работаем по всей России</li>
<li><a href="/blog">Блог</a> — разборы правил сервисов и практика доставки</li>
<li><a href="/kalkulyatory">Калькуляторы</a> — рентабельность, ДРР, НДС и модель доставки</li>
<li><a href="/razbor-otchetov">Разбор отчётов</a> — фактическая нагрузка на оборот</li>
<li><a href="/slovar">Глоссарий доставки</a> — ${GLOSSARY.length} терминов простым языком</li>
<li><a href="/chek-listy">Чек-листы</a> · <a href="/testy">Тесты</a> · <a href="/sravnenie-agregatorov">Сравнение агрегаторов</a></li>
</ul>
<p>Телефон: +7 931 002-82-22</p>`,
})
  .replace(/<link rel="canonical"[^>]*>\n?/, "")
  .replace(
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>',
    '<meta name="robots" content="noindex, follow"/>',
  )
  .replace('<meta name="yandex" content="index, follow"/>', '<meta name="yandex" content="noindex"/>');

fs.writeFileSync(path.join(OUT, "404.html"), notFoundHtml, "utf-8");
console.log("404.html создан");

const PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/uslugi": 0.9,
  "/goroda": 0.9,
  "/blog": 0.9,
  "/kalkulyatory": 0.9,
  "/slovar": 0.9,
  "/sravnenie-agregatorov": 0.9,
  "/razbor-otchetov": 0.9,
  "/chek-listy": 0.8,
  "/testy": 0.8,
  "/pochitat": 0.8,
  "/partnery": 0.7,
};

const priorityOf = (route: string) => {
  if (PRIORITY[route]) return PRIORITY[route];
  if (route.startsWith("/slovar/")) return 0.6;
  if (route.startsWith("/blog/")) return 0.7;
  if (route.startsWith("/kalkulyatory/")) return 0.8;
  if (route.startsWith("/uslugi/") || route.startsWith("/goroda/")) return 0.8;
  return 0.6;
};

const freqOf = (route: string) =>
  route === "/" || route === "/blog" ? "weekly" : "monthly";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

const POST_DATES = new Map(
  ALL_POSTS.map((p) => [`/blog/${p.slug}`, (p.date || BUILD_DATE).slice(0, 10)]),
);

const lastmodOf = (route: string) => POST_DATES.get(route) || BUILD_DATE;

const sitemapRoutes = Array.from(
  new Set([
    "/",
    ...pages.filter((p) => !p.canonical).map((p) => p.route),
  ]),
).sort();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r === "/" ? "/" : r}</loc>
    <lastmod>${lastmodOf(r)}</lastmod>
    <changefreq>${freqOf(r)}</changefreq>
    <priority>${priorityOf(r).toFixed(1)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap, "utf-8");
console.log(`Sitemap: ${sitemapRoutes.length} страниц`);

let count = 0;
for (const p of pages) {
  const dir = path.join(OUT, p.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(p), "utf-8");
  count++;
}

console.log(`Пререндер: ${count} страниц`);

// --- Чистка служебных скриптов платформы -----------------------------------
// Инспектор редактора, телеметрия и роутер предпросмотра нужны только внутри
// poehali.dev. На своём хостинге это лишние запросы к чужому домену и
// зависимость от его доступности.
//
// Страницы пререндера их и не содержат — теги остаются только в dist/index.html,
// который Vite собирает из корневого index.html. Сам index.html не трогаем:
// там эти теги нужны, иначе сломается предпросмотр в редакторе.
const stripPlatformScripts = () => {
  const target = path.join(OUT, "index.html");
  if (!fs.existsSync(target)) return;

  const src = fs.readFileSync(target, "utf-8");
  const scriptRe =
    /[ \t]*<script[^>]*src="https:\/\/cdn\.poehali\.dev\/[^"]*"[^>]*>\s*<\/script>\s*\n?/g;
  const commentRe =
    /[ \t]*<!--\s*IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS COMMENT!\s*-->\s*\n?/g;
  const metaRe = /[ \t]*<meta name="pp-name"[^>]*>\s*\n?/g;

  const hits = src.match(scriptRe)?.length ?? 0;
  if (!hits) return;

  fs.writeFileSync(
    target,
    src.replace(scriptRe, "").replace(commentRe, "").replace(metaRe, ""),
    "utf-8",
  );
  console.log(`Служебные скрипты платформы удалены: ${hits} тегов`);
};

stripPlatformScripts();