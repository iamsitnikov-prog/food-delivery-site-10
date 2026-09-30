export type Block = { h: string; p: string };

export type SeoPage = {
  slug: string;
  kind: "service" | "city";
  navLabel: string;
  h1: string;
  lead: string;
  title: string;
  description: string;
  blocks: Block[];
  bullets: string[];
  faq: { q: string; a: string }[];
  /** «Когда нужна услуга»: 3–4 ситуации клиента, короткий заголовок + одна-две фразы. */
  when?: { t: string; d: string }[];
  /** «Как проходит работа»: 4–5 шагов по порядку. */
  steps?: { t: string; d: string }[];
  /** Выделенный результат: крупная цифра, подпись и пояснение. Только реальные данные. */
  result?: { value: string; label: string; text: string };
  /** «Что нужно от вас»: короткие пункты. */
  needFromYou?: string[];
  /** «Сколько стоит»: цена и пояснение. */
  price?: { value: string; text: string };
};
