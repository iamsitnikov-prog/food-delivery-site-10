import fs from "fs";
import path from "path";
import { BLOG_POSTS } from "../src/data/blog-posts";

const SITE = "https://agregatory.pro";
const FEED_TITLE = "Блог agregatory.pro — разборы для рестораторов";
const FEED_DESC =
  "Подробные материалы о работе ресторанов с агрегаторами доставки: продвижение, экономика, правила сервисов и практика запуска.";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clean = (s: string) => s.replace(/\u00a0/g, " ").trim();

const rfc822 = (date: string) => new Date(`${date}T09:00:00+03:00`).toUTCString();

const blocksToHtml = (blocks: any[]): string => {
  const out: string[] = [];

  for (const b of blocks) {
    switch (b.type) {
      case "p":
        out.push(`<p>${esc(clean(b.text))}</p>`);
        break;
      case "h2":
        out.push(`<h2>${esc(clean(b.text))}</h2>`);
        break;
      case "h3":
        out.push(`<h3>${esc(clean(b.text))}</h3>`);
        break;
      case "list":
        out.push(`<ul>${b.items.map((i: string) => `<li>${esc(clean(i))}</li>`).join("")}</ul>`);
        break;
      case "numbered":
        out.push(`<ol>${b.items.map((i: string) => `<li>${esc(clean(i))}</li>`).join("")}</ol>`);
        break;
      case "quote":
        out.push(`<blockquote><p>${esc(clean(b.text))}</p></blockquote>`);
        break;
      case "table": {
        const head: string[] = b.head.map(clean);
        const rows: string[] = b.rows.map((row: string[]) => {
          const cells = row.map(clean);
          const first = cells[0] ?? "";
          const rest = cells.slice(1).map((c, i) => `${head[i + 1] ? `${head[i + 1]}: ` : ""}${c}`);
          return `<li><b>${esc(first)}</b>${rest.length ? ` — ${esc(rest.join("; "))}` : ""}</li>`;
        });
        out.push(`<ul>${rows.join("")}</ul>`);
        break;
      }
      case "partner":
        out.push(
          `<p>${esc(clean(b.text))} <a href="${esc(b.url)}" rel="nofollow">${esc(clean(b.name))}</a>${
            b.promo ? ` — промокод ${esc(clean(b.promo))}` : ""
          }</p>`,
        );
        break;
      default:
        break;
    }
  }

  return out.join("\n");
};

const faqToHtml = (faq: { q: string; a: string }[]): string => {
  if (!faq?.length) return "";
  const items = faq.map((f) => `<h3>${esc(clean(f.q))}</h3><p>${esc(clean(f.a))}</p>`).join("");
  return `<h2>Частые вопросы</h2>${items}`;
};

const buildFeed = (posts: any[]): string => {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latest = sorted[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = sorted
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const html = `${blocksToHtml(p.blocks)}\n${faqToHtml(p.faq)}`;

      return `    <item>
      <title>${esc(clean(p.h1))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <author>info@agregatory.pro (agregatory.pro)</author>
      <category>${esc(clean(p.tag))}</category>
      <description>${esc(clean(p.description))}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(FEED_DESC)}</description>
    <language>ru</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
    <image>
      <url>${SITE}/og-preview.jpg</url>
      <title>${esc(FEED_TITLE)}</title>
      <link>${SITE}/blog</link>
    </image>
${items}
  </channel>
</rss>
`;
};

const target = path.resolve(process.cwd(), "public/rss.xml");
const xml = buildFeed(BLOG_POSTS);
const current = fs.existsSync(target) ? fs.readFileSync(target, "utf-8") : "";

if (current !== xml) {
  fs.writeFileSync(target, xml, "utf-8");
  console.log(`rss.xml обновлён: ${BLOG_POSTS.length} статей`);
} else {
  console.log("rss.xml без изменений");
}