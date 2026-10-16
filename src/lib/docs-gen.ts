// Сборка договора для страницы /dokumenty: сумма прописью, склонения,
// расшифровка шаблона и подстановка данных (docxtemplater).

const ONES_M = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
const ONES_F = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
const TEENS = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
const TENS = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
const HUNDREDS = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];

/** Форма слова по числу: 1 точка, 2 точки, 5 точек. */
export const plural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
};

const triad = (n: number, fem: boolean) => {
  const out: string[] = [];
  out.push(HUNDREDS[Math.floor(n / 100)]);
  const t = n % 100;
  if (t >= 10 && t < 20) out.push(TEENS[t - 10]);
  else {
    out.push(TENS[Math.floor(t / 10)]);
    out.push((fem ? ONES_F : ONES_M)[t % 10]);
  }
  return out.filter(Boolean).join(" ");
};

/** Целое число прописью. fem: «одна/две» (для женского рода). */
export const numberWords = (n: number, fem = false): string => {
  n = Math.floor(Math.abs(n));
  if (n === 0) return "ноль";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions) parts.push(triad(millions, false), plural(millions, "миллион", "миллиона", "миллионов"));
  if (thousands) parts.push(triad(thousands, true), plural(thousands, "тысяча", "тысячи", "тысяч"));
  if (rest) parts.push(triad(rest, fem));
  return parts.filter(Boolean).join(" ");
};

/** 50000 → «50 000» (пробел между разрядами, как в шаблоне). */
export const money = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const MONTHS_NOM = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

/** «2026-10-17» → «17 октября 2026» (в шаблоне дальше идёт «года»). */
export const dateWords = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS_GEN[m - 1]} ${y}`;
};

/** «2026-11» → «ноябрь 2026». */
export const monthYear = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return "";
  return `${MONTHS_NOM[m - 1]} ${y}`;
};

/** Отчётный период: календарный месяц или с 16-го по 15-е число следующего месяца. */
export type Period = "month" | "16-15";
export const PERIOD_UNIT: Record<Period, string> = {
  month: "календарный месяц",
  "16-15": "период с 16-го числа календарного месяца по 15-е число следующего календарного месяца",
};
/** Первый отчётный период для образцов: «ноябрь 2026» или «период с 16.11.2026 по 15.12.2026». */
export const firstPeriod = (ym: string, p: Period) => {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return "";
  if (p === "month") return monthYear(ym);
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  const mm = (n: number) => String(n).padStart(2, "0");
  return `период с 16.${mm(m)}.${y} по 15.${mm(nm)}.${ny}`;
};

/** ЗАГЛАВНЫЕ из реестра → «Иванов Иван Иванович». */
export const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|[\s\-«"(.])([а-яёa-z])/g, (_, p, c) => p + c.toUpperCase());

/** «Иванов Иван Иванович» → «Иванов И.И.» */
export const shortName = (full: string) => {
  const [last, first, middle] = full.trim().split(/\s+/);
  if (!last) return "";
  return [last, first ? ` ${first[0]}.` : "", middle ? `${middle[0]}.` : ""].join("");
};

export type Gender = "male" | "female";

/** Пол по отчеству: -вна/-чна/-кызы → женский. */
export const genderOf = (full: string): Gender => {
  const middle = full.trim().split(/\s+/)[2] || "";
  return /(вна|чна|кызы|гызы)$/i.test(middle) ? "female" : "male";
};

/** ФИО в родительном падеже: «Иванова Ивана Ивановича». */
export const genitive = async (full: string, gender: Gender) => {
  const { default: petrovich } = await import("petrovich");
  const [last = "", first = "", middle = ""] = full.trim().split(/\s+/);
  const r = petrovich({ last, first, middle, gender }, "genitive");
  return [r.last, r.first, r.middle].filter(Boolean).join(" ");
};

// --- Шаблоны ----------------------------------------------------------------

const b64 = (s: string) => new TextEncoder().encode(s);

/** Расшифровывает шаблон: 'AGD1' | соль 16 | nonce 12 | AES-GCM. */
export const decryptTemplate = async (buf: ArrayBuffer, password: string) => {
  const raw = new Uint8Array(buf);
  if (new TextDecoder().decode(raw.slice(0, 4)) !== "AGD1") throw new Error("Повреждённый шаблон");
  const salt = raw.slice(4, 20);
  const nonce = raw.slice(20, 32);
  const base = await crypto.subtle.importKey("raw", b64(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200_000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce, additionalData: b64("agregatory-docs") }, key, raw.slice(32));
};

export const renderDocx = async (template: ArrayBuffer, data: Record<string, unknown>) => {
  const [{ default: PizZip }, { default: Docxtemplater }] = await Promise.all([
    import("pizzip"),
    import("docxtemplater"),
  ]);
  const doc = new Docxtemplater(new PizZip(template), {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "",
  });
  doc.render(data);
  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }) as Blob;
};
