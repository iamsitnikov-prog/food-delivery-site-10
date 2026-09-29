import { BASE_TERMS } from "./base";
import { MARKETING_TERMS } from "./marketing";
import { ECONOMICS_TERMS } from "./economics";
import { OPERATIONS_TERMS } from "./operations";
import { OWN_CHANNEL_TERMS } from "./own-channel";
import type { GlossaryEntry, GlossaryTerm } from "./types";
import { BLOG_POSTS } from "../blog-posts";

export { GLOSSARY_GROUPS } from "./types";
export type { GlossaryTerm, GlossaryGroup, GlossaryEntry, TermSection } from "./types";

const ALL: GlossaryEntry[] = [
  ...BASE_TERMS,
  ...MARKETING_TERMS,
  ...ECONOMICS_TERMS,
  ...OPERATIONS_TERMS,
  ...OWN_CHANNEL_TERMS,
];

const firstLetter = (s: string) => s.trim().replace(/^[«"']/, "")[0].toUpperCase();

export const isLatinLetter = (l: string) => /^[A-Z]$/.test(l);

/**
 * Статьи блога с будущей датой в сборку не попадают, поэтому ссылка на них
 * из глоссария дала бы 404. Оставляем только те, что уже опубликованы.
 */
const today = new Date().toISOString().slice(0, 10);
const livePosts = new Set(
  BLOG_POSTS.filter((p) => !p.date || p.date <= today).map((p) => `/blog/${p.slug}`),
);

const keepLiveLinks = (links?: { label: string; to: string }[]) => {
  if (!links) return undefined;
  const kept = links.filter((l) => !l.to.startsWith("/blog/") || livePosts.has(l.to));
  return kept.length > 0 ? kept : undefined;
};

export const GLOSSARY: GlossaryTerm[] = ALL.map((t) => ({
  ...t,
  letter: firstLetter(t.term),
  links: keepLiveLinks(t.links),
})).sort((a, b) => a.term.localeCompare(b.term, "ru"));

export const getTerm = (slug: string) => GLOSSARY.find((t) => t.slug === slug);

/** Кириллица идёт первой, латиница — отдельной группой следом. */
export const GLOSSARY_LETTERS = Array.from(new Set(GLOSSARY.map((t) => t.letter))).sort(
  (a, b) => {
    const la = isLatinLetter(a);
    const lb = isLatinLetter(b);
    if (la !== lb) return la ? 1 : -1;
    return a.localeCompare(b, la ? "en" : "ru");
  },
);

export const CYRILLIC_LETTERS = GLOSSARY_LETTERS.filter((l) => !isLatinLetter(l));
export const LATIN_LETTERS = GLOSSARY_LETTERS.filter((l) => isLatinLetter(l));

export const countByLetter = (letter: string) =>
  GLOSSARY.filter((t) => t.letter === letter).length;

export const getRelated = (term: GlossaryTerm) =>
  (term.see ?? [])
    .map((slug) => GLOSSARY.find((t) => t.slug === slug))
    .filter((t): t is GlossaryTerm => Boolean(t));

/** Термины той же темы — для блока «рядом по теме» на странице термина. */
export const getSameGroup = (term: GlossaryTerm, limit = 6) =>
  GLOSSARY.filter((t) => t.group === term.group && t.slug !== term.slug).slice(0, limit);