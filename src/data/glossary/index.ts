import { BASE_TERMS } from "./base";
import { MARKETING_TERMS } from "./marketing";
import { ECONOMICS_TERMS } from "./economics";
import { OPERATIONS_TERMS } from "./operations";
import { OWN_CHANNEL_TERMS } from "./own-channel";
import type { GlossaryEntry, GlossaryTerm } from "./types";

export { GLOSSARY_GROUPS } from "./types";
export type { GlossaryTerm, GlossaryGroup, GlossaryEntry } from "./types";

const ALL: GlossaryEntry[] = [
  ...BASE_TERMS,
  ...MARKETING_TERMS,
  ...ECONOMICS_TERMS,
  ...OPERATIONS_TERMS,
  ...OWN_CHANNEL_TERMS,
];

const LATIN = "A-Z";

const firstLetter = (s: string) => {
  const ch = s.trim().replace(/^[«"']/, "")[0].toUpperCase();
  return /[А-ЯЁ]/.test(ch) ? ch : LATIN;
};

export const GLOSSARY: GlossaryTerm[] = ALL.map((t) => ({
  ...t,
  letter: firstLetter(t.term),
})).sort((a, b) => a.term.localeCompare(b.term, "ru"));

export const getTerm = (slug: string) => GLOSSARY.find((t) => t.slug === slug);

export const GLOSSARY_LETTERS = Array.from(new Set(GLOSSARY.map((t) => t.letter))).sort((a, b) => {
  if (a === LATIN) return 1;
  if (b === LATIN) return -1;
  return a.localeCompare(b, "ru");
});

export const countByLetter = (letter: string) =>
  GLOSSARY.filter((t) => t.letter === letter).length;

export const getRelated = (term: GlossaryTerm) =>
  (term.see ?? [])
    .map((slug) => GLOSSARY.find((t) => t.slug === slug))
    .filter((t): t is GlossaryTerm => Boolean(t));
