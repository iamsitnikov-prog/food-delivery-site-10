export type GlossaryGroup =
  | "Деньги и метрики"
  | "Реклама и выдача"
  | "Операционка"
  | "Качество и рейтинг"
  | "Документы и право"
  | "Свой канал и CRM";

/**
 * Развёрнутый блок на странице термина: подзаголовок + текст.
 * В текстах допустимы ссылки в виде [анкор](/адрес) — они превращаются
 * в обычные ссылки и в приложении, и в предрендеренном HTML.
 */
export type TermSection = {
  title: string;
  /** Один абзац — короткая форма записи. */
  body?: string;
  /** Несколько абзацев до таблицы или списка. */
  paragraphs?: string[];
  /** Таблица, первая строка — шапка. */
  table?: string[][];
  /** Маркированный список. */
  list?: string[];
  /** Абзацы после таблицы или списка. */
  after?: string[];
  /** Раздел добавлен отдельным обновлением — заголовок уровня H2. */
  level2?: boolean;
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
  /** Связанные термины в утверждённом порядке: адреса вида /slovar/slug. */
  related?: string[];
  /** Страница услуги для карточки заявки. */
  service?: string;
  /** Калькулятор по теме термина. Пусто — блок расчёта не показываем. */
  calculator?: string;
  /** Комментарий эксперта — свой у каждого термина. */
  expert?: { name: string; text: string };
  /** Ссылки внутри основного текста: первое вхождение анкора. */
  inTextLinks?: { anchor: string; to: string }[];
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