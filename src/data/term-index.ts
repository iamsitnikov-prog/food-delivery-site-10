/**
 * Лёгкий справочник терминов: название, категория, короткое описание.
 *
 * Его можно грузить на любой странице — он маленький. Развёрнутый текст
 * термина лежит отдельным файлом и подгружается только на своей странице
 * через loadTerm().
 */
import type { GlossaryTerm, GlossaryGroup } from "./glossary/types";
import INDEX from "./generated/term-index.json";

export { GLOSSARY_GROUPS } from "./glossary/types";
export type {
  GlossaryTerm,
  GlossaryGroup,
  GlossaryEntry,
  TermSection,
} from "./glossary/types";

/** Краткая запись термина — то, что нужно поиску и перелинковке. */
export type TermBrief = {
  slug: string;
  term: string;
  short: string;
  letter: string;
  group: GlossaryGroup;
  see?: string[];
};

/** Запись для карточки в списке глоссария — с описанием и формулой. */
export type TermCard = TermBrief & {
  full: string;
  formula?: string;
  example?: string;
  links?: { label: string; to: string }[];
};

export const TERM_INDEX = INDEX as TermBrief[];

/** Совместимость с прежним названием: списки ждут GLOSSARY. */
export const GLOSSARY = TERM_INDEX;

export const isLatinLetter = (l: string) => /^[A-Z]$/.test(l);

export const getBrief = (slug: string) =>
  TERM_INDEX.find((t) => t.slug === slug);

/** Кириллица идёт первой, латиница — отдельной группой следом. */
export const GLOSSARY_LETTERS = Array.from(
  new Set(TERM_INDEX.map((t) => t.letter)),
).sort((a, b) => {
  const la = isLatinLetter(a);
  const lb = isLatinLetter(b);
  if (la !== lb) return la ? 1 : -1;
  return a.localeCompare(b, la ? "en" : "ru");
});

export const CYRILLIC_LETTERS = GLOSSARY_LETTERS.filter((l) => !isLatinLetter(l));
export const LATIN_LETTERS = GLOSSARY_LETTERS.filter((l) => isLatinLetter(l));

export const countByLetter = (letter: string) =>
  TERM_INDEX.filter((t) => t.letter === letter).length;

export const getRelated = (term: { see?: string[] }) =>
  (term.see ?? [])
    .map((slug) => getBrief(slug))
    .filter((t): t is TermBrief => Boolean(t));

/** Термины той же темы — для блока «рядом по теме». */
export const getSameGroup = (
  term: { group: GlossaryGroup; slug: string },
  limit = 6,
) =>
  TERM_INDEX.filter((t) => t.group === term.group && t.slug !== term.slug).slice(
    0,
    limit,
  );

/**
 * Карточки для страницы /slovar: описание, формула, пример.
 * Отдельным файлом — на других страницах этот вес не нужен.
 */
// Уже загруженные данные. Нужны, чтобы страница, отрисованная заранее на
// сервере, сразу (без «загрузки») совпала с тем, что рисует браузер.
let cardsCache: TermCard[] | null = null;
const termCache = new Map<string, GlossaryTerm>();
export const getCachedTermCards = () => cardsCache;
export const getCachedTerm = (slug?: string) => (slug ? termCache.get(slug) ?? null : null);

export const loadTermCards = async (): Promise<TermCard[]> => {
  if (cardsCache) return cardsCache;
  const mod = await import("./generated/term-cards.json");
  cardsCache = (mod.default ?? mod) as TermCard[];
  return cardsCache;
};

/**
 * Полный текст одного термина. Подгружается отдельным файлом, поэтому
 * страница термина не тянет за собой все остальные.
 */
export const loadTerm = async (slug: string): Promise<GlossaryTerm | null> => {
  if (!getBrief(slug)) return null;
  const cached = termCache.get(slug);
  if (cached) return cached;
  try {
    const mod = await import(`./generated/terms/${slug}.json`);
    const term = (mod.default ?? mod) as GlossaryTerm;
    termCache.set(slug, term);
    return term;
  } catch {
    return null;
  }
};
