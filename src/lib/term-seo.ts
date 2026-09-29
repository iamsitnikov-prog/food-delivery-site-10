const BRAND = " | agregatory.pro";
const MAX_TITLE = 65;
const MAX_DESC = 158;

/** Заголовок подстраивается под длину термина, чтобы уложиться в выдачу. */
export const termTitle = (term: { term: string }) => {
  const name = term.term;
  const full = `${name} — что это такое простыми словами${BRAND}`;
  if (full.length <= MAX_TITLE) return full;

  const short = `${name} — что это простыми словами${BRAND}`;
  if (short.length <= MAX_TITLE) return short;

  const plain = `${name} — что это такое${BRAND}`;
  if (plain.length <= MAX_TITLE) return plain;

  const bare = `${name}${BRAND}`;
  return bare.length <= MAX_TITLE ? bare : name;
};

const cut = (s: string, limit: number) => {
  if (s.length <= limit) return s;
  const slice = s.slice(0, limit - 1);
  const stop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(", "), slice.lastIndexOf(" "));
  return `${slice.slice(0, stop > limit * 0.6 ? stop : slice.length).replace(/[.,;:\s]+$/, "")}…`;
};

export const termDescription = (term: {
  term: string;
  short: string;
  formula?: string;
  /** Есть ли на странице разбор с цифрами: блок «Пример» или формула. */
  hasExample?: boolean;
}) => {
  const base = `${term.term}: ${term.short}`;
  const withFormula = term.formula ? `${base} Формула: ${term.formula}.` : base;
  if (withFormula.length <= MAX_DESC) {
    // Про пример расчёта пишем только там, где он действительно есть,
    // иначе описание обещает больше, чем на странице.
    const tail = term.hasExample
      ? " Простым языком, с примером расчёта."
      : " Простым языком: типичные ошибки и ответы на частые вопросы.";
    if (withFormula.length + tail.length <= MAX_DESC) return withFormula + tail;

    const shortTail = term.hasExample ? " С примером расчёта." : " Простым языком.";
    return withFormula.length + shortTail.length <= MAX_DESC
      ? withFormula + shortTail
      : withFormula;
  }
  return cut(withFormula, MAX_DESC);
};
