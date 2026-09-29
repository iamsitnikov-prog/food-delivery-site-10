import type { GlossaryTerm } from "@/data/term-index";

const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e",
  ю: "yu", я: "ya",
};

/** Латинский якорь из русского заголовка — ссылки остаются читаемыми. */
export const anchorId = (title: string) =>
  title
    .toLowerCase()
    .split("")
    .map((c) => (c in MAP ? MAP[c] : c))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "razdel";

export type TocItem = { id: string; title: string; level: 2 | 3 };

/**
 * Оглавление статьи термина. Порядок повторяет разметку страницы,
 * поэтому ссылки ведут ровно на те блоки, что видит читатель.
 */
export const buildToc = (term: GlossaryTerm): TocItem[] => {
  const items: TocItem[] = [{ id: "chto-eto-znachit", title: "что это значит", level: 2 }];

  if (term.formula) items.push({ id: "kak-schitat", title: "как считать", level: 3 });
  if (term.example) items.push({ id: "primer", title: "пример", level: 3 });
  if (term.mistake) items.push({ id: "tipichnaya-oshibka", title: "типичная ошибка", level: 3 });

  for (const s of term.sections ?? []) {
    items.push({ id: anchorId(s.title), title: s.title, level: s.level2 ? 2 : 3 });
  }

  if (term.faq?.length) items.push({ id: "chastye-voprosy", title: "частые вопросы", level: 2 });

  return items;
};