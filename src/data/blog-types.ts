export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "partner"; name: string; url: string; text: string; cta?: string; promo?: string }
  /** Предложение своей услуги внутри статьи: внутренняя ссылка, без «инструмента партнёра». */
  | { type: "offer"; title: string; text: string; url: string; cta: string; telegram?: boolean };

export type BlogPost = {
  slug: string;
  title: string;
  h1: string;
  lead: string;
  description: string;
  date: string;
  dateLabel: string;
  readTime: string;
  tag: string;
  isNew?: boolean;
  pinned?: boolean;
  toc: { id: string; label: string }[];
  blocks: PostBlock[];
  faq: { q: string; a: string }[];
};