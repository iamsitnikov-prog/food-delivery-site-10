export type GlossaryGroup =
  | "Деньги и метрики"
  | "Реклама и выдача"
  | "Операционка"
  | "Качество и рейтинг"
  | "Документы и право"
  | "Свой канал и CRM";

/** Развёрнутый блок на странице термина: подзаголовок + текст. */
export type TermSection = {
  title: string;
  body: string;
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  full: string;
  formula?: string;
  example?: string;
  letter: string;
  group: GlossaryGroup;
  links?: { label: string; to: string }[];
  see?: string[];
  /** Развёрнутая часть: как применять, типичные ошибки, нюансы. */
  sections?: TermSection[];
  /** Частые вопросы по термину — попадают и в разметку для поисковиков. */
  faq?: { q: string; a: string }[];
  /** Типичная ошибка одной фразой — короткий заметный блок. */
  mistake?: string;
};

export type GlossaryEntry = Omit<GlossaryTerm, "letter">;

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  "Деньги и метрики",
  "Реклама и выдача",
  "Операционка",
  "Качество и рейтинг",
  "Документы и право",
  "Свой канал и CRM",
];