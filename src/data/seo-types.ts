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
};
