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

// --- Проверка реквизитов по контрольным числам ФНС -----------------------------

const sumW = (d: string, w: number[]) => w.reduce((s, k, i) => s + Number(d[i]) * k, 0);

/** Ошибка в ИНН или "" (10 цифр у организации, 12 у ИП, контрольные цифры по правилам ФНС). */
export const innError = (v: string, kind: "ooo" | "ip") => {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  const need = kind === "ooo" ? 10 : 12;
  if (d.length !== need) return `ИНН ${kind === "ooo" ? "организации" : "ИП"}: ${need} цифр, сейчас ${d.length}`;
  if (need === 10) {
    const c = (sumW(d, [2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11) % 10;
    return c === Number(d[9]) ? "" : "ИНН не проходит проверку: где-то опечатка";
  }
  const c1 = (sumW(d, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11) % 10;
  const c2 = (sumW(d, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11) % 10;
  return c1 === Number(d[10]) && c2 === Number(d[11]) ? "" : "ИНН не проходит проверку: где-то опечатка";
};

/** Ошибка в ОГРН (13 цифр) или ОГРНИП (15 цифр) или "". */
export const ogrnError = (v: string, kind: "ooo" | "ip") => {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  const need = kind === "ooo" ? 13 : 15;
  const nm = kind === "ooo" ? "ОГРН" : "ОГРНИП";
  if (d.length !== need) return `${nm}: ${need} цифр, сейчас ${d.length}`;
  const mod = kind === "ooo" ? 11n : 13n;
  const c = Number((BigInt(d.slice(0, -1)) % mod) % 10n);
  return c === Number(d[need - 1]) ? "" : `${nm} не проходит проверку: где-то опечатка`;
};

/** Ошибка в КПП или "": 9 знаков, 5 и 6 могут быть буквами. */
export const kppError = (v: string) => {
  const d = v.trim().toUpperCase();
  if (!d) return "";
  if (d.length !== 9) return `КПП: 9 знаков, сейчас ${d.length}`;
  return /^\d{4}[\dA-Z]{2}\d{3}$/.test(d) ? "" : "КПП: 9 цифр (5 и 6 знак могут быть латинскими буквами)";
};

// --- Карточка организации одним текстом → поля формы ---------------------------

export type CardData = Partial<{
  kind: "ooo" | "ip";
  inn: string; kpp: string; ogrn: string; name: string; address: string; person: string;
  position: "Генеральный директор" | "Директор";
  bik: string; rs: string; ks: string; bank: string; phone: string; email: string;
}>;

/** Раскладывает карточку организации (текст из письма, Word или PDF) по полям. */
export const parseCard = (raw: string): CardData => {
  const t = raw.replace(/ /g, " ").replace(/[ \t]+/g, " ");
  const out: CardData = {};
  const num = (re: RegExp) => t.match(re)?.[1];
  // ИНН/КПП часто пишут вместе: «ИНН/КПП 7801234564/780101001»
  const pair = t.match(/ИНН\s*\/\s*КПП[^\d]{0,10}(\d{10})\s*\/\s*(\d{4}[\dA-Z]{2}\d{3})/i);
  out.inn = pair?.[1] || num(/ИНН[^\d\n]{0,15}(\d{12}|\d{10})(?!\d)/i);
  out.kpp = pair?.[2] || num(/КПП[^\d\n]{0,15}(\d{4}[\dA-Z]{2}\d{3})(?![\dA-Z])/i);
  out.ogrn = num(/ОГРН(?:ИП)?[^\d\n]{0,15}(\d{15}|\d{13})(?!\d)/i);
  out.bik = num(/БИК[^\d\n]{0,15}(\d{9})(?!\d)/i);
  out.rs =
    num(/(?:р\s*\/\s*с(?:ч[её]т)?|р\.\s*с\.|расч[её]тный\s+сч[её]т|расч\.\s*сч[её]т)[^\d\n]{0,20}(\d{20})/i) ||
    t.match(/\b(40[5-8]\d{17})\b/)?.[1];
  out.ks =
    num(/(?:к\s*\/\s*с(?:ч[её]т)?|кор+\.?\s*\/?\s*сч[её]т|корреспондентский\s+сч[её]т|корр?\.\s*сч\.?)[^\d\n]{0,20}(\d{20})/i) ||
    t.match(/\b(301\d{17})\b/)?.[1];
  const bank = t.match(/(?:^|\n)\s*(?:Банк(?:\s+получателя)?|Наименование\s+банка)\s*[:\-–]?\s*([^\n]{4,})/i)?.[1];
  if (bank && !/^\s*БИК/i.test(bank)) out.bank = bank.trim().replace(/[;,.]$/, "");
  const am = t.match(/(?:Юридический\s+адрес|Юр\.?\s*адрес|Адрес\s+регистрации|Адрес\s+места\s+нахождения|Местонахождение|Адрес)\s*[:\-–]?\s*([^\n]{8,})((?:\n[^\n]*){0,2})/i);
  if (am) {
    // адрес в таблице часто переносится на следующую строку: берём продолжение, пока не начался другой реквизит
    let a = am[1];
    const label = /^(ИНН|КПП|ОГРН|Генеральн|Директор|Руковод|Банк|БИК|Р\s*\/\s*с|Расч|Корр|К\s*\/\s*с|Тел|E-?mail|Эл\.|Почт|ОКПО|ОКВЭД|ОКТМО|ОКАТО|Адрес|Факт|Сайт|Наименование|Полное|Сокращ)/i;
    for (const next of am[2].split("\n").slice(1)) {
      const n = next.trim();
      if (!n || label.test(n) || /:\s/.test(n.slice(0, 30))) break;
      a += " " + n;
    }
    const lat2cyr: Record<string, string> = { A: "А", B: "В", C: "С", E: "Е", H: "Н", K: "К", M: "М", O: "О", P: "Р", T: "Т", X: "Х" };
    out.address = a
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[;]$/, "")
      // после распознавания скана «3-H» бывает латиницей: меняем похожие буквы на русские
      .replace(/(\d-?)([ABCEHKMOPTX])\b/g, (_, d, l) => d + lat2cyr[l]);
  }
  const fio = "([А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?\\s+[А-ЯЁ][а-яё]+(?:\\s+[А-ЯЁ][а-яё]+)?)";
  const head = t.match(new RegExp(`(Генеральный\\s+директор|Директор|Руководитель)\\s*[:\\-–]?\\s*${fio}`, "i"));
  if (head) {
    out.person = head[2].trim();
    out.position = /^Директор/i.test(head[1]) ? "Директор" : "Генеральный директор";
  }
  const ip = t.match(new RegExp(`(?:Индивидуальный\\s+предприниматель|(?:^|[^А-Яа-яЁё])ИП)\\s+${fio}`));
  if (ip && (!out.inn || out.inn.length === 12)) {
    out.kind = "ip";
    out.person = ip[1].trim();
  } else if (out.inn?.length === 10 || /ООО|Общество с ограниченной/i.test(t)) out.kind = "ooo";
  const name = t.match(/(?:ООО|Общество\s+с\s+ограниченной\s+ответственностью)\s*[«"“„']([^»"”“']+)[»"”“']/i)?.[1];
  if (name) out.name = name.replace(/\s+/g, " ").trim();
  out.phone = t.match(/(?:\+7|(?<!\d)8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}\b/)?.[0]?.trim();
  out.email = t.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)?.[0];
  (Object.keys(out) as (keyof CardData)[]).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};
