export type QuizOption = { label: string; score: number; hint?: string };

export type QuizQuestion = {
  id: string;
  block: string;
  question: string;
  note?: string;
  options: QuizOption[];
};

export type QuizLevel = {
  min: number;
  title: string;
  label: string;
  summary: string;
  advice: string[];
};

export type QuizDef = {
  slug: string;
  icon: string;
  navLabel: string;
  h1: string;
  title: string;
  description: string;
  lead: string;
  intro: string;
  minutes: string;
  kind: "audit" | "knowledge";
  questions: QuizQuestion[];
  levels: QuizLevel[];
};

export const maxScore = (q: QuizQuestion[]) =>
  q.reduce((sum, x) => sum + Math.max(...x.options.map((o) => o.score)), 0);
