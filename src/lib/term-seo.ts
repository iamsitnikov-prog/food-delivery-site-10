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
}) => {
  const base = `${term.term}: ${term.short}`;
  const withFormula = term.formula ? `${base} Формула: ${term.formula}.` : base;
  if (withFormula.length <= MAX_DESC) {
    const tail = " Простым языком, с примером расчёта.";
    return withFormula.length + tail.length <= MAX_DESC ? withFormula + tail : withFormula;
  }
  return cut(withFormula, MAX_DESC);
};
