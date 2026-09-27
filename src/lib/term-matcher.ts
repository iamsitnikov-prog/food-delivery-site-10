import { GLOSSARY } from "@/data/glossary";

const BACKLINKS = new Map<string, string[]>();
for (const t of GLOSSARY) {
  for (const l of t.links ?? []) {
    const cur = BACKLINKS.get(l.to) ?? [];
    cur.push(t.slug);
    BACKLINKS.set(l.to, cur);
  }
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Термины короче пяти букв ищем целым словом, иначе «ФОТ» находится в «фото». */
const buildMatcher = (term: string) => {
  const base = norm(term)
    .replace(/\s*\([^)]*\)/g, "")
    .trim();
  const head = base.split(/[/,]/)[0].trim();
  if (head.length < 3) return null;
  const body = escape(head).replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^а-яa-z0-9-])${body}([^а-яa-z0-9-]|$)`, "i");
};

const MATCHERS = GLOSSARY.map((t) => ({ slug: t.slug, re: buildMatcher(t.term) })).filter(
  (m): m is { slug: string; re: RegExp } => m.re !== null,
);

export const termsForRoute = (route: string, text: string, limit = 6) => {
  const picked: string[] = [...(BACKLINKS.get(route) ?? [])];

  if (picked.length < limit) {
    const hay = norm(text);
    for (const m of MATCHERS) {
      if (picked.length >= limit) break;
      if (picked.includes(m.slug)) continue;
      if (m.re.test(hay)) picked.push(m.slug);
    }
  }

  return picked.slice(0, limit);
};
