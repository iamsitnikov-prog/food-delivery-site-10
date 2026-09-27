import * as XLSX from "xlsx";

export type ReportKind = "payments" | "orders" | "transcript" | "fulfilment";

export type Bucket = {
  key: string;
  label: string;
  sum: number;
  count: number;
  hint: string;
  suspicious?: boolean;
};

export type Payment = {
  label: string;
  sum: number;
};

export type ParsedReport = {
  kind: ReportKind;
  kindLabel: string;
  company?: string;
  inn?: string;
  contract?: string;
  period?: string;
  orders: number;
  gross: number;
  withheld: number;
  net: number;
  realRate: number;
  declaredRate?: number;
  buckets: Bucket[];
  payments: Payment[];
  paymentsTotal: number;
  reconciled: boolean | null;
  reconcileDiff: number;
  reconcileNote: string;
  extra: { label: string; value: string; hint?: string }[];
  warnings: string[];
};

const RULES: {
  test: RegExp;
  key: string;
  label: string;
  hint: string;
  suspicious?: boolean;
}[] = [
  {
    test: /оплата по заказу/i,
    key: "income",
    label: "Поступления по заказам",
    hint: "Деньги, которые гости заплатили за ваши блюда. Это ещё не ваш доход — из этой суммы удержат всё остальное.",
  },
  {
    test: /стоимость услуг за заказ|размер стоимости услуг/i,
    key: "commission",
    label: "Комиссия агрегатора",
    hint: "Основная плата площадке — тот самый процент из договора. Считается от стоимости заказа и включает НДС.",
  },
  {
    test: /продвижени|маркетинговые услуги|cpa|сра-маркетинг/i,
    key: "promo",
    label: "Продвижение и реклама",
    hint: "Платное продвижение в приложении. Это НЕ комиссия — это отдельная услуга, которую вы можете отключить в кабинете. Проверьте, что вы её осознанно подключали.",
  },
  {
    test: /подписка/i,
    key: "subscription",
    label: "Подписка (Стандарт/Бизнес)",
    hint: "Переменная часть подписки на тариф. Списывается с каждого заказа помимо комиссии.",
  },
  {
    test: /буст/i,
    key: "boost",
    label: "Услуга «Буст»",
    hint: "Разовое поднятие позиции в выдаче. Часто включают на акцию и забывают выключить.",
  },
  {
    test: /умная цена|умной цены/i,
    key: "smartprice",
    label: "Опция «Умная цена»",
    hint: "Сервис сам меняет цены для привлечения гостей, разницу удерживает с вас.",
  },
  {
    test: /программа плюс|яндекс плюс/i,
    key: "plus",
    label: "Программа Яндекс Плюс",
    hint: "Баллы Плюса, которыми расплатился гость. Сервис компенсирует их частично за ваш счёт.",
  },
  {
    test: /еда для курьеров/i,
    key: "couriers",
    label: "Еда для курьеров",
    hint: "Заказы по программе питания курьеров со скидкой за ваш счёт.",
  },
  {
    test: /стоимость доставки за счет ресторана|доставка ресторана/i,
    key: "delivery",
    label: "Доставка за счёт ресторана",
    hint: "Вы оплачиваете курьера сами — эта сумма удерживается из выручки.",
  },
  {
    test: /п\.?\s?14\.7|оферте п/i,
    key: "offer147",
    label: "Удержания по п. 14.7 оферты",
    hint: "Штраф за отсутствующую позицию или недовложение. Оспаривается через поддержку, если вы не виноваты — например, гость отменил сам. Проверьте каждую строку.",
    suspicious: true,
  },
  {
    test: /компенсаци|претенз|штраф|неустойк/i,
    key: "penalty",
    label: "Компенсации и штрафы",
    hint: "Возвраты гостям и претензии за ваш счёт. Самая спорная категория — требуйте детализацию по каждому случаю.",
    suspicious: true,
  },
  {
    test: /ваучер/i,
    key: "voucher",
    label: "Ваучеры",
    hint: "Компенсационные ваучеры гостям за счёт ресторана.",
    suspicious: true,
  },
  {
    test: /возврат/i,
    key: "refund",
    label: "Возвраты",
    hint: "Возвраты средств по отменённым заказам.",
  },
  {
    test: /чаевы|доплат|дополнительное вознаграждение/i,
    key: "tips",
    label: "Чаевые и доплаты",
    hint: "Деньги в вашу пользу сверх стоимости заказа.",
  },
];

const classify = (comment: string) => {
  const c = (comment || "").trim();
  for (const r of RULES) if (r.test.test(c)) return r;
  return {
    test: /./,
    key: "other",
    label: "Прочие операции",
    hint: "Операция, которую не удалось отнести к известной категории. Стоит уточнить у менеджера площадки.",
    suspicious: true,
  };
};

const num = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.replace(/\s|\u00a0/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    const n = Number.parseFloat(s);
    if (Number.isFinite(n)) return n;
  }
  return Number.NaN;
};

const txt = (v: unknown) => (v == null ? "" : String(v).trim());

const humanPeriod = (v: unknown) => {
  if (v instanceof Date) return v.toLocaleDateString("ru-RU");
  const s = txt(v);
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}.${iso[2]}.${iso[1]}`;
  return s;
};

const isIndexRow = (row: unknown[]) => {
  const vals = row.map((c) => num(c)).filter((n) => Number.isFinite(n));
  if (vals.length < 2) return false;
  return vals.every((n, i) => n === i + 1);
};

const rub = (n: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);

type Grid = unknown[][];

const findHeader = (grid: Grid, keys: string[], limit = 30) => {
  for (let i = 0; i < Math.min(grid.length, limit); i++) {
    const row = (grid[i] || []).map((c) => txt(c).toLowerCase());
    const joined = row.join(" | ");
    if (keys.every((k) => joined.includes(k))) return i;
  }
  return -1;
};

const colIndex = (header: unknown[], ...names: string[]) => {
  const low = header.map((h) => txt(h).toLowerCase());
  for (const n of names) {
    const i = low.findIndex((h) => h.includes(n));
    if (i >= 0) return i;
  }
  return -1;
};

const metaFrom = (grid: Grid) => {
  const meta: Record<string, string> = {};
  for (let i = 0; i < Math.min(grid.length, 12); i++) {
    const row = grid[i] || [];
    for (let j = 0; j < row.length - 1; j++) {
      const k = txt(row[j]).toLowerCase();
      const v = row[j + 1];
      if (!k || v == null) continue;
      if (k.includes("инн")) meta.inn = txt(v);
      else if (k.includes("компания")) meta.company = txt(v);
      else if (k.includes("договор")) meta.contract = txt(v);
      else if (k.includes("период") || k.includes("месяц")) {
        meta.period = humanPeriod(v);
      }
    }
  }
  return meta;
};

const buildBuckets = (map: Map<string, Bucket>) =>
  [...map.values()].sort((a, b) => a.sum - b.sum);

const finish = (
  base: Omit<ParsedReport, "realRate" | "net" | "reconciled" | "reconcileDiff" | "reconcileNote"> & {
    reconciled?: boolean | null;
    reconcileDiff?: number;
    reconcileNote?: string;
  },
): ParsedReport => {
  const net = base.gross - base.withheld;
  const realRate = base.gross > 0 ? (base.withheld / base.gross) * 100 : 0;
  return {
    ...base,
    net,
    realRate,
    reconciled: base.reconciled ?? null,
    reconcileDiff: base.reconcileDiff ?? 0,
    reconcileNote: base.reconcileNote ?? "",
  };
};

const parsePayments = (grid: Grid): ParsedReport => {
  const meta = metaFrom(grid);
  const h = findHeader(grid, ["сумма транзакции"]);
  if (h < 0) throw new Error("Не нашёл таблицу с транзакциями");
  const header = grid[h] || [];
  const cSum = colIndex(header, "сумма транзакции");
  const cComment = colIndex(header, "комментарий");
  const cPp = colIndex(header, "платежное поручение", "платёжное поручение");
  const cPpSum = colIndex(header, "сумма п/п");
  const cOrder = colIndex(header, "номер заказа");
  const cStatus = colIndex(header, "статус");

  const map = new Map<string, Bucket>();
  const payments = new Map<string, number>();
  const orderSet = new Set<string>();
  let gross = 0;
  let withheld = 0;
  let rows = 0;

  for (let i = h + 1; i < grid.length; i++) {
    const r = grid[i] || [];
    const s = num(r[cSum]);
    if (!Number.isFinite(s)) continue;
    rows++;
    const comment = txt(r[cComment]);
    const rule = classify(comment);
    const cur = map.get(rule.key) || {
      key: rule.key,
      label: rule.label,
      sum: 0,
      count: 0,
      hint: rule.hint,
      suspicious: rule.suspicious,
    };
    cur.sum += s;
    cur.count += 1;
    map.set(rule.key, cur);

    if (s > 0) gross += s;
    else withheld += -s;

    if (cOrder >= 0) {
      const o = txt(r[cOrder]);
      if (o) orderSet.add(o);
    }
    if (cPp >= 0 && cPpSum >= 0) {
      const p = txt(r[cPp]);
      const v = num(r[cPpSum]);
      if (p && Number.isFinite(v)) payments.set(p, v);
    }
  }

  if (!rows) throw new Error("В файле не нашлось ни одной транзакции");

  const paymentsTotal = [...payments.values()].reduce((a, b) => a + b, 0);
  const balance = gross - withheld;
  const diff = balance - paymentsTotal;
  const ok = Math.abs(diff) < 0.5;

  const commission = map.get("commission")?.sum ?? 0;
  const declaredRate = gross > 0 ? (Math.abs(commission) / gross) * 100 : undefined;

  const warnings: string[] = [];
  if (cStatus >= 0) {
    let cancelled = 0;
    for (let i = h + 1; i < grid.length; i++) {
      const st = txt((grid[i] || [])[cStatus]).toLowerCase();
      if (st && !st.includes("доставлен") && !st.includes("статус")) cancelled++;
    }
    if (cancelled > 0)
      warnings.push(
        `Найдено ${cancelled} строк со статусом, отличным от «Доставлен». Проверьте, не удержаны ли по ним комиссии.`,
      );
  }

  return finish({
    kind: "payments",
    kindLabel: "Отчёт по платёжным поручениям",
    ...meta,
    orders: orderSet.size,
    gross,
    withheld,
    declaredRate,
    buckets: buildBuckets(map),
    payments: [...payments.entries()].map(([label, sum]) => ({ label, sum })),
    paymentsTotal,
    reconciled: payments.size > 0 ? ok : null,
    reconcileDiff: diff,
    reconcileNote: payments.size
      ? ok
        ? "Сумма всех строк отчёта в точности совпала с суммой платёжных поручений. Деньги на счёт пришли полностью."
        : `Сумма строк отчёта и сумма платёжек расходятся на ${rub(Math.abs(diff))} ₽. Это повод запросить сверку у площадки.`
      : "В файле нет колонки с платёжными поручениями — сверить с поступлениями не получилось.",
    extra: [],
    warnings,
  });
};

const parseOrders = (grid: Grid): ParsedReport => {
  const meta = metaFrom(grid);
  const h = findHeader(grid, ["номер заказа", "статус"]);
  if (h < 0) throw new Error("Не нашёл таблицу заказов");
  const header = grid[h] || [];
  const cPay = colIndex(header, "оплата по заказу");
  const cRate = colIndex(header, "процент стоимости услуг");
  const cFee = colIndex(header, "размер стоимости услуг");
  const cOther = colIndex(header, "прочие удержания");
  const cSurcharge = colIndex(header, "доплаты");
  const cOrder = colIndex(header, "номер заказа");

  const map = new Map<string, Bucket>();
  const add = (key: string, label: string, hint: string, sum: number, suspicious?: boolean) => {
    if (!sum) return;
    const cur = map.get(key) || { key, label, sum: 0, count: 0, hint, suspicious };
    cur.sum += sum;
    cur.count += 1;
    map.set(key, cur);
  };

  let gross = 0;
  let fees = 0;
  let other = 0;
  let surcharge = 0;
  let orders = 0;
  const rates = new Set<string>();

  for (let i = h + 1; i < grid.length; i++) {
    const r = grid[i] || [];
    const order = cOrder >= 0 ? txt(r[cOrder]) : "";
    const pay = num(r[cPay]);
    if (!order || !Number.isFinite(pay)) continue;
    if (/^0$/.test(order)) continue;
    orders++;
    gross += pay;
    const f = num(r[cFee]);
    if (Number.isFinite(f)) fees += f;
    const o = num(r[cOther]);
    if (Number.isFinite(o)) other += o;
    const s = num(r[cSurcharge]);
    if (Number.isFinite(s)) surcharge += s;
    const rt = txt(r[cRate]);
    if (rt) rates.add(rt);
  }

  if (!orders) throw new Error("В файле не нашлось заказов");

  add("income", "Поступления по заказам", RULES[0].hint, gross);
  add("commission", "Комиссия агрегатора", RULES[1].hint, fees);
  if (other)
    add(
      "penalty",
      "Прочие удержания",
      "Сюда попадают штрафы, компенсации и удержания по офертам. Требуйте расшифровку по каждой строке.",
      other,
      true,
    );
  if (surcharge)
    add("tips", "Доплаты (чаевые, доставка)", RULES[13].hint, surcharge);

  const withheld = Math.abs(fees) + Math.abs(other);
  const declared = [...rates][0];
  const declaredRate = declared ? num(declared.replace("%", "")) : undefined;

  const warnings: string[] = [];
  const headSum = grid
    .slice(0, h)
    .flat()
    .filter((v) => typeof v === "number") as number[];
  if (headSum.length && headSum.every((v) => v === 0))
    warnings.push(
      "В шапке файла итоговые суммы показаны нулями: там формулы, которые Excel пересчитает только при открытии. Ориентируйтесь на расчёт ниже — он сделан по строкам заказов.",
    );

  return finish({
    kind: "orders",
    kindLabel: "Информационный отчёт по заказам",
    ...meta,
    orders,
    gross,
    withheld,
    declaredRate: Number.isFinite(declaredRate as number) ? declaredRate : undefined,
    buckets: buildBuckets(map),
    payments: [],
    paymentsTotal: 0,
    reconciled: null,
    reconcileDiff: 0,
    reconcileNote:
      "В этом отчёте нет платёжных поручений — сверить с фактическими поступлениями можно по недельному отчёту.",
    extra: [
      { label: "Заказов в периоде", value: String(orders) },
      {
        label: "Средний чек",
        value: `${rub(Math.round(gross / orders))} ₽`,
        hint: "Оборот, делённый на число заказов.",
      },
    ],
    warnings,
  });
};

const parseTranscript = (wb: XLSX.WorkBook): ParsedReport => {
  const main = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(main, { header: 1, raw: true, defval: null });
  const meta = metaFrom(grid);
  const h = findHeader(grid, ["номер заказа", "тип доставки"]);
  if (h < 0) throw new Error("Не нашёл таблицу расшифровки");
  const header = grid[h] || [];

  const cOrder = colIndex(header, "номер заказа");
  const cCost = colIndex(header, "стоимость заказа");
  const cRate = colIndex(header, "процент стоимости услуг");

  const FIELDS: { names: string[]; key: string }[] = [
    { names: ["размер стоимости услуг"], key: "commission" },
    { names: ["тариф ультима"], key: "other" },
    { names: ["умная цена"], key: "smartprice" },
    { names: ["программа плюс"], key: "plus" },
    { names: ["платная подписка"], key: "subscription" },
    { names: ["еда для курьеров"], key: "couriers" },
    { names: ["баллы за скидки"], key: "other" },
    { names: ["стоимость доставки за счет ресторана"], key: "delivery" },
    { names: ["вознаграждение за услуги cpa"], key: "promo" },
    { names: ["стоимость услуги \"буст\"", "услуги «буст»", "буст"], key: "boost" },
    { names: ["удержание по оферте п. 14.7"], key: "offer147" },
    { names: ["сумма удержания"], key: "penalty" },
  ];

  const map = new Map<string, Bucket>();
  const addTo = (key: string, sum: number) => {
    if (!sum) return;
    const rule = RULES.find((r) => r.key === key);
    const cur = map.get(key) || {
      key,
      label: rule?.label ?? "Прочие удержания",
      sum: 0,
      count: 0,
      hint: rule?.hint ?? "Дополнительное удержание по договору.",
      suspicious: rule?.suspicious,
    };
    cur.sum += sum;
    cur.count += 1;
    map.set(key, cur);
  };

  let gross = 0;
  let orders = 0;
  const rates = new Set<string>();

  for (let i = h + 1; i < grid.length; i++) {
    const r = grid[i] || [];
    const order = txt(r[cOrder]);
    if (!order || /^0$/.test(order) || /^\d{1,2}$/.test(order)) continue;
    const cost = num(r[cCost]);
    if (!Number.isFinite(cost)) continue;
    orders++;
    gross += cost;
    const rt = txt(r[cRate]);
    if (rt) rates.add(rt);
    for (const f of FIELDS) {
      const idx = colIndex(header, ...f.names);
      if (idx < 0) continue;
      const v = num(r[idx]);
      if (Number.isFinite(v) && v < 0) addTo(f.key, v);
    }
  }

  if (!orders) throw new Error("В расшифровке не нашлось заказов");

  if (!meta.period) {
    const cDate = colIndex(header, "дата");
    const dates: string[] = [];
    for (let i = h + 1; i < grid.length; i++) {
      const d = (grid[i] || [])[cDate];
      const s = humanPeriod(d);
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(s)) dates.push(s);
    }
    if (dates.length) {
      const sorted = [...dates].sort((a, b) => {
        const [da, ma, ya] = a.split(".");
        const [db, mb, yb] = b.split(".");
        return `${ya}${ma}${da}`.localeCompare(`${yb}${mb}${db}`);
      });
      meta.period =
        sorted[0] === sorted[sorted.length - 1]
          ? sorted[0]
          : `${sorted[0]} - ${sorted[sorted.length - 1]}`;
    }
  }

  const withheld = [...map.values()]
    .filter((b) => b.sum < 0)
    .reduce((a, b) => a + Math.abs(b.sum), 0);

  addTo("income", gross);
  const incomeBucket = map.get("income");
  if (incomeBucket) {
    incomeBucket.sum = gross;
    incomeBucket.count = orders;
  }

  const warnings: string[] = [];
  const penalties = wb.SheetNames.find((n) => /штраф/i.test(n));
  if (penalties) {
    const pg = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[penalties], {
      header: 1,
      defval: null,
    });
    const ph = findHeader(pg, ["сумма предъявленного штрафа"], 10);
    if (ph >= 0) {
      let sum = 0;
      let cnt = 0;
      for (let i = ph + 1; i < pg.length; i++) {
        const row = pg[i] || [];
        if (isIndexRow(row)) continue;
        const v = num(row[2]);
        if (Number.isFinite(v) && v !== 0) {
          sum += v;
          cnt++;
        }
      }
      if (cnt)
        warnings.push(
          `На листе «Штрафы» ${cnt} записей на ${rub(Math.abs(sum))} ₽. Каждый штраф можно оспорить через поддержку, если вина не ваша.`,
        );
    }
  }

  const cpa = wb.SheetNames.find((n) => /cpa|сра/i.test(n));
  if (cpa) {
    const cg = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[cpa], { header: 1, defval: null });
    const rows = cg.filter((r) => txt((r || [])[0]) && !/номер/i.test(txt((r || [])[0])));
    if (rows.length)
      warnings.push(`На листе CPA-продвижения ${rows.length} заказов с платным привлечением.`);
  }

  const declaredRate = [...rates][0] ? num([...rates][0].replace("%", "")) : undefined;

  return finish({
    kind: "transcript",
    kindLabel: "Расшифровка к отчёту",
    ...meta,
    orders,
    gross,
    withheld,
    declaredRate: Number.isFinite(declaredRate as number) ? declaredRate : undefined,
    buckets: buildBuckets(map),
    payments: [],
    paymentsTotal: 0,
    reconciled: null,
    reconcileDiff: 0,
    reconcileNote:
      "Расшифровка показывает состав удержаний по каждому заказу. Для сверки с деньгами на счёте нужен отчёт по платёжным поручениям.",
    extra: [
      { label: "Заказов в расшифровке", value: String(orders) },
      { label: "Листов в файле", value: wb.SheetNames.join(", ") },
    ],
    warnings,
  });
};

const pickNumber = (text: string, ...patterns: RegExp[]) => {
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) {
      const v = num(m[1]);
      if (Number.isFinite(v)) return v;
    }
  }
  return Number.NaN;
};

export const parseFulfilment = (text: string): ParsedReport => {
  const flat = text.replace(/\s+/g, " ");
  const N = "(-?\\d[\\d\\s\\u00a0]*(?:[.,]\\d+)?)";

  const opening = pickNumber(flat, new RegExp(`Входящее сальдо на начало отчетного периода\\*?\\s*${N}\\s`, "i"));
  const total = pickNumber(flat, new RegExp(`Итого сумма денежных средств, подлежащая перечислению[^:]*:?\\s*${N}\\s`, "i"));
  const withheld = pickNumber(flat, new RegExp(`Подлежит удержанию:?\\s*${N}\\s`, "i"));
  const services = pickNumber(flat, new RegExp(`Стоимость Услуг Яндекс\\.?Еда\\s*${N}\\s`, "i"));
  const toPay = pickNumber(flat, new RegExp(`Подлежит к перечислению\\s*${N}\\s`, "i"));
  const paid = pickNumber(flat, new RegExp(`Фактически перечислено на расчетный счет[^\\d-]*${N}\\s`, "i"));
  const closing = pickNumber(flat, new RegExp(`Исходящее сальдо на конец отчетного периода\\*?\\s*${N}\\s`, "i"));
  const claims = pickNumber(flat, new RegExp(`Сумма признанной претензии\\s*${N}\\s*рубл`, "i"));
  const penalty = pickNumber(flat, new RegExp(`Неустойка, начисленная за Отчетный период[^\\d-]*${N}\\s`, "i"));
  const offer147 = pickNumber(flat, new RegExp(`Удержание средств согласно п\\.?\\s?14\\.7 оферты\\s*${N}\\s`, "i"));
  const returned = pickNumber(flat, new RegExp(`Безналичные платежи, возвращенные Пользователям по Заказам\\s*${N}\\s`, "i"));

  if (!Number.isFinite(total) && !Number.isFinite(toPay))
    throw new Error("Это не похоже на отчёт об исполнении поручения");

  const period = flat.match(/г\.\s?Москва\s+(\d{2}\.\d{2}\.\d{4})/i)?.[1];
  const company = flat.match(/по поручению\s+(.+?)\s*\(далее/i)?.[1];
  const contract = flat.match(/№\s?([\d/]+)\s+от\s+\d{2}\.\d{2}\.\d{4}/)?.[1];

  const map = new Map<string, Bucket>();
  const put = (key: string, label: string, hint: string, sum: number, suspicious?: boolean) => {
    if (!Number.isFinite(sum) || sum === 0) return;
    map.set(key, { key, label, sum, count: 1, hint, suspicious });
  };

  put("income", "Принято от гостей и подлежит перечислению", RULES[0].hint, Math.abs(total));
  put(
    "commission",
    "Стоимость услуг площадки",
    "Комиссия и услуги площадки за период. Эта сумма должна совпасть с суммой актов выше в документе.",
    -Math.abs(services),
  );
  put(
    "offer147",
    "Удержания по п. 14.7 оферты",
    RULES.find((r) => r.key === "offer147")!.hint,
    -Math.abs(offer147),
    true,
  );
  put(
    "penalty",
    "Неустойка по договору",
    "Штрафы за нарушение условий договора. Проверьте основание каждого начисления.",
    -Math.abs(penalty),
    true,
  );
  put(
    "refund",
    "Возвраты гостям",
    "Деньги, возвращённые гостям по отменённым заказам. Часть возвращается за ваш счёт — эту часть стоит проверять.",
    -Math.abs(returned),
  );

  const gross = Math.abs(total);
  const w = Math.abs(withheld);

  const checks: { ok: boolean; text: string }[] = [];
  if (Number.isFinite(total) && Number.isFinite(withheld) && Number.isFinite(toPay)) {
    const d = total - w - toPay;
    checks.push({
      ok: Math.abs(d) < 0.5,
      text:
        Math.abs(d) < 0.5
          ? "Подлежит к перечислению = Итого поступлений минус удержания. Сходится."
          : `Итого минус удержания не равно строке «Подлежит к перечислению»: расхождение ${rub(Math.abs(d))} ₽.`,
    });
  }

  let reconciled: boolean | null = null;
  let diff = 0;
  let note = "";
  if (Number.isFinite(opening) && Number.isFinite(toPay) && Number.isFinite(paid) && Number.isFinite(closing)) {
    const calc = opening + toPay - paid;
    diff = calc - closing;
    reconciled = Math.abs(diff) < 0.5;
    note = reconciled
      ? `Сальдо сходится: ${rub(opening)} на начало плюс ${rub(toPay)} к перечислению минус ${rub(paid)} выплачено даёт ${rub(closing)} ₽ на конец периода. Эти деньги не потеряны — они перейдут в следующий период.`
      : `Сальдо не сходится на ${rub(Math.abs(diff))} ₽. Запросите у площадки расшифровку движения средств.`;
  } else {
    note = "Не удалось найти все строки сальдо — проверьте, что загружен полный отчёт об исполнении поручения.";
  }

  const warnings: string[] = [];
  if (Number.isFinite(closing) && closing > 0)
    warnings.push(
      `На конец периода за площадкой осталось ${rub(closing)} ₽ — это исходящее сальдо. Деньги придут в следующем периоде, но убедитесь, что они появились как входящее сальдо в следующем отчёте.`,
    );
  if (Number.isFinite(claims) && claims > 0)
    warnings.push(`Признанные претензии: ${rub(claims)} ₽. Проверьте, по каким заказам они начислены.`);
  for (const c of checks) if (!c.ok) warnings.push(c.text);

  const extra: { label: string; value: string; hint?: string }[] = [];
  const pushExtra = (label: string, v: number, hint?: string) => {
    if (Number.isFinite(v)) extra.push({ label, value: `${rub(v)} ₽`, hint });
  };
  pushExtra("Входящее сальдо", opening, "Долг площадки перед вами с прошлого периода.");
  pushExtra("Подлежит к перечислению", toPay, "Сколько площадка должна за этот период.");
  pushExtra("Фактически перечислено", paid, "Сколько реально ушло на ваш расчётный счёт.");
  pushExtra(
    "Исходящее сальдо",
    closing,
    "Остаток, переходящий на следующий период. Это не потеря — но проследите, чтобы он дошёл.",
  );
  if (Number.isFinite(claims) && claims)
    extra.push({ label: "Признанные претензии", value: `${rub(claims)} ₽` });

  return finish({
    kind: "fulfilment",
    kindLabel: "Отчёт об исполнении поручения",
    company: company?.replace(/^[«"](.*)["»]$/, "$1").trim(),
    contract,
    period,
    orders: 0,
    gross,
    withheld: w,
    buckets: buildBuckets(map),
    payments: [],
    paymentsTotal: Number.isFinite(paid) ? paid : 0,
    reconciled,
    reconcileDiff: diff,
    reconcileNote: note,
    extra,
    warnings,
  });
};

const detectKind = (wb: XLSX.WorkBook, grid: Grid): ReportKind => {
  const head = grid
    .slice(0, 6)
    .flat()
    .map((c) => txt(c).toLowerCase())
    .join(" ");
  if (wb.SheetNames.some((n) => /расшифровк/i.test(n))) return "transcript";
  if (head.includes("платежным поручениям") || head.includes("платёжным поручениям"))
    return "payments";
  if (head.includes("информационный отчет") || head.includes("информационный отчёт"))
    return "orders";
  const joined = grid
    .slice(0, 20)
    .flat()
    .map((c) => txt(c).toLowerCase())
    .join(" | ");
  if (joined.includes("сумма транзакции")) return "payments";
  return "orders";
};

export const parseWorkbook = (data: ArrayBuffer): ParsedReport => {
  const wb = XLSX.read(data, { type: "array", cellDates: true });
  if (!wb.SheetNames.length) throw new Error("В файле нет листов");
  const first = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(first, {
    header: 1,
    raw: true,
    defval: null,
  });
  const kind = detectKind(wb, grid);
  if (kind === "transcript") return parseTranscript(wb);
  if (kind === "payments") return parsePayments(grid);
  return parseOrders(grid);
};

export const formatRub = rub;
