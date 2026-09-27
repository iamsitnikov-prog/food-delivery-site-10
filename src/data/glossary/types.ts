export type GlossaryGroup =
  | "Деньги и метрики"
  | "Реклама и выдача"
  | "Операционка"
  | "Качество и рейтинг"
  | "Документы и право"
  | "Свой канал и CRM";

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
