import type * as XLSXType from "xlsx";

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
    label: "Оборот по заказам",
    hint: "Безналичные платежи гостей, принятые сервисом в вашу пользу. Это валовый оборот до удержаний, а не выручка к получению.",
  },
  {
    test: /стоимость услуг за заказ|размер стоимости услуг/i,
    key: "commission",
    label: "Вознаграждение за услуги",
    hint: "Вознаграждение сервиса за услуги по договору — тот самый процент. В отчёте называется «стоимость услуг», а не «комиссия»: юридически это плата за услуги по приёму и обработке заказов. Считается от базы расчёта и указывается с НДС.",
  },
  {
    test: /продвижени|маркетинговые услуги|cpa|сра-маркетинг/i,
    key: "promo",
    label: "Маркетинговые услуги и продвижение",
    hint: "Платное продвижение в приложении сервиса. Это не вознаграждение за услуги по заказу, а отдельная маркетинговая услуга по самостоятельному договору-оферте. Подключается и отключается партнёром в личном кабинете.",
  },
  {
    test: /подписка/i,
    key: "subscription",
    label: "Абонентская плата за тариф",
    hint: "Переменная часть абонентской платы за тарифный план. Удерживается с каждого заказа дополнительно к вознаграждению за услуги.",
  },
  {
    test: /буст/i,
    key: "boost",
    label: "Услуга «Буст»",
    hint: "Платное повышение позиции карточки в выдаче сервиса. Действует до отключения партнёром, поэтому период стоит сверять с периодом акции.",
  },
  {
    test: /умная цена|умной цены/i,
    key: "smartprice",
    label: "Опция «Умная цена»",
    hint: "Опция, при которой сервис самостоятельно корректирует цены в меню для привлечения гостей. Разницу между вашей ценой и ценой продажи удерживают с вас.",
  },
  {
    test: /программа плюс|яндекс плюс/i,
    key: "plus",
    label: "Программа Яндекс Плюс",
    hint: "Часть заказа, оплаченная гостем баллами программы лояльности сервиса. Эти баллы софинансируются: доля партнёра удерживается из вашей выручки.",
  },
  {
    test: /еда для курьеров/i,
    key: "couriers",
    label: "Еда для курьеров",
    hint: "Заказы в рамках программы питания курьеров. Скидка по таким заказам предоставляется за счёт партнёра.",
  },
  {
    test: /стоимость доставки за счет ресторана|доставка ресторана/i,
    key: "delivery",
    label: "Доставка за счёт партнёра",
    hint: "Логистику по заказу обеспечивает партнёр или сервис за счёт партнёра — стоимость доставки удерживается из выручки.",
  },
  {
    test: /п\.?\s?14\.7|оферте п/i,
    key: "offer147",
    label: "Удержания по п. 14.7 оферты",
    hint: "Удержание по пункту 14.7 оферты: сервис компенсировал гостю стоимость отсутствующей позиции или недовложения за счёт партнёра. Основание оспаривается через поддержку — при снятии удержания в следующем периоде появляется строка возврата.",
    suspicious: true,
  },
  {
    test: /компенсаци|претенз|штраф|неустойк/i,
    key: "penalty",
    label: "Компенсации гостям и неустойки",
    hint: "Компенсации гостям и признанные претензии, отнесённые на партнёра. По каждой позиции можно запросить основание в поддержке — это стандартная процедура.",
    suspicious: true,
  },
  {
    test: /ваучер/i,
    key: "voucher",
    label: "Ваучеры",
    hint: "Компенсационные ваучеры, выданные гостям за счёт партнёра по пункту 14.7 оферты.",
    suspicious: true,
  },
  {
    test: /возврат/i,
    key: "refund",
    label: "Возвраты",
    hint: "Возвраты гостям по отменённым заказам. Часть возвращается за счёт сервиса, часть — за счёт партнёра: в отчёте эти суммы разделены.",
  },
  {
    test: /чаевы|доплат|дополнительное вознаграждение/i,
    key: "tips",
    label: "Чаевые и доплаты",
    hint: "Суммы в пользу партнёра сверх стоимости заказа: чаевые и оплата доставки, когда логистику обеспечивает партнёр.",
  },
];

const classify = (comment: string) => {
  const c = (comment || "").trim();
  for (const r of RULES) if (r.test.test(c)) return r;
  return {
    test: /./,
    key: "other",
    label: "Прочие операции",
    hint: "Операция, которую не удалось отнести к известной категории удержаний. Расшифровку можно запросить у менеджера сервиса.",
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
  if (h < 0) throw new Error("В файле не найдена таблица транзакций");
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

  if (!rows) throw new Error("В файле не найдено ни одной транзакции");

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
        `Найдено ${cancelled} строк со статусом, отличным от «Доставлен». Убедитесь, что по отменённым заказам не удержано вознаграждение за услуги.`,
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
        ? "Сумма транзакций по всем строкам отчёта совпала с суммой платёжных поручений до копейки. Расчёты за период закрыты полностью."
        : `Сумма транзакций и сумма платёжных поручений расходятся на ${rub(Math.abs(diff))} ₽. Основание для запроса акта сверки у сервиса.`
      : "В файле нет реквизитов платёжных поручений — сопоставить с фактическими поступлениями невозможно.",
    extra: [],
    warnings,
  });
};

const parseOrders = (grid: Grid): ParsedReport => {
  const meta = metaFrom(grid);
  const h = findHeader(grid, ["номер заказа", "статус"]);
  if (h < 0) throw new Error("В файле не найдена таблица заказов");
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

  if (!orders) throw new Error("В файле не найдено ни одного заказа");

  add("income", "Оборот по заказам", RULES[0].hint, gross);
  add("commission", "Вознаграждение за услуги", RULES[1].hint, fees);
  if (other)
    add(
      "penalty",
      "Прочие удержания",
      "Свёрнутая категория: неустойки, компенсации гостям и удержания по пунктам оферты. Состав раскрывается только в расшифровке к отчёту.",
      other,
      true,
    );
  if (surcharge)
    add("tips", "Доплаты: чаевые и доставка", RULES[13].hint, surcharge);

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
      "Итоговые значения в шапке файла заданы формулами и до пересчёта в Excel отображаются нулями. Расчёт ниже выполнен напрямую по строкам заказов и корректен.",
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
      "Информационный отчёт не содержит реквизитов платёжных поручений. Сверка с фактическими поступлениями выполняется по отчёту о платёжных поручениях за тот же период.",
    extra: [
      { label: "Заказов в периоде", value: String(orders) },
      {
        label: "Средний чек",
        value: `${rub(Math.round(gross / orders))} ₽`,
        hint: "Валовый оборот, делённый на количество заказов в периоде.",
      },
    ],
    warnings,
  });
};

const parseTranscript = (
  wb: XLSXType.WorkBook,
  XLSX: typeof XLSXType,
): ParsedReport => {
  const main = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(main, { header: 1, raw: true, defval: null });
  const meta = metaFrom(grid);
  const h = findHeader(grid, ["номер заказа", "тип доставки"]);
  if (h < 0) throw new Error("В файле не найдена таблица расшифровки");
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

  if (!orders) throw new Error("В расшифровке не найдено ни одного заказа");

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
          `На листе «Штрафы» ${cnt} записей на ${rub(Math.abs(sum))} ₽. По каждой позиции можно запросить основание: при неподтверждённой вине партнёра удержание снимается.`,
        );
    }
  }

  const cpa = wb.SheetNames.find((n) => /cpa|сра/i.test(n));
  if (cpa) {
    const cg = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[cpa], { header: 1, defval: null });
    const rows = cg.filter((r) => txt((r || [])[0]) && !/номер/i.test(txt((r || [])[0])));
    if (rows.length)
      warnings.push(`На листе CPA-продвижения ${rows.length} заказов с оплатой за результат. Вознаграждение по ним начисляется сверх стоимости услуг за заказ.`);
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
      "Расшифровка раскрывает состав удержаний по каждому заказу, но не содержит платёжных реквизитов. Для сверки с поступлениями используйте отчёт о платёжных поручениях.",
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
    throw new Error("Документ не распознан как отчёт об исполнении поручения");

  const period = flat.match(/г\.\s?Москва\s+(\d{2}\.\d{2}\.\d{4})/i)?.[1];
  const company = flat.match(/по поручению\s+(.+?)\s*\(далее/i)?.[1];
  const contract = flat.match(/№\s?([\d/]+)\s+от\s+\d{2}\.\d{2}\.\d{4}/)?.[1];

  const map = new Map<string, Bucket>();
  const put = (key: string, label: string, hint: string, sum: number, suspicious?: boolean) => {
    if (!Number.isFinite(sum) || sum === 0) return;
    map.set(key, { key, label, sum, count: 1, hint, suspicious });
  };

  put("income", "Принято от гостей и подлежит перечислению партнёру", RULES[0].hint, Math.abs(total));
  put(
    "commission",
    "Стоимость услуг сервиса",
    "Стоимость услуг сервиса за отчётный период. Значение должно совпадать с суммой актов, перечисленных в разделе 2 этого же документа.",
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
    "Неустойка, начисленная за отчётный период в соответствии с договором. Основание стоит уточнить до подписания отчёта.",
    -Math.abs(penalty),
    true,
  );
  put(
    "refund",
    "Возвраты гостям",
    "Безналичные платежи, возвращённые гостям. Отдельной строкой выделена часть, возвращённая за счёт партнёра, — она и влияет на вашу выручку.",
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
          : `Итого поступлений минус удержания не равно строке «Подлежит к перечислению». Расхождение ${rub(Math.abs(d))} ₽.`,
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
      ? `Движение денежных средств сходится: ${rub(opening)} ₽ входящее сальдо плюс ${rub(toPay)} ₽ к перечислению минус ${rub(paid)} ₽ фактически перечислено даёт ${rub(closing)} ₽ исходящего сальдо. Разница между начисленным и выплаченным — это переходящий остаток, а не недоплата.`
      : `Сальдо не сходится на ${rub(Math.abs(diff))} ₽. Запросите у сервиса расшифровку движения денежных средств за период.`;
  } else {
    note = "Не удалось распознать все строки раздела 3. Убедитесь, что загружен полный отчёт об исполнении поручения без изменений.";
  }

  const warnings: string[] = [];
  if (Number.isFinite(closing) && closing > 0)
    warnings.push(
      `Исходящее сальдо — ${rub(closing)} ₽. Это задолженность сервиса перед вами, переходящая на следующий период. Проконтролируйте, что сумма отражена как входящее сальдо в следующем отчёте.`,
    );
  if (Number.isFinite(claims) && claims > 0)
    warnings.push(`Сумма признанной претензии — ${rub(claims)} ₽. Запросите перечень заказов, по которым она начислена.`);
  for (const c of checks) if (!c.ok) warnings.push(c.text);

  const extra: { label: string; value: string; hint?: string }[] = [];
  const pushExtra = (label: string, v: number, hint?: string) => {
    if (Number.isFinite(v)) extra.push({ label, value: `${rub(v)} ₽`, hint });
  };
  pushExtra("Входящее сальдо", opening, "Задолженность сервиса перед партнёром, перешедшая с предыдущего отчётного периода.");
  pushExtra("Подлежит к перечислению", toPay, "Сумма к перечислению партнёру по расчётам за отчётный период.");
  pushExtra("Фактически перечислено", paid, "Сумма, фактически перечисленная на расчётный счёт партнёра в отчётном периоде.");
  pushExtra(
    "Исходящее сальдо",
    closing,
    "Задолженность сервиса на конец периода. Не является потерей, но требует контроля в следующем отчёте.",
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

const detectKind = (wb: XLSXType.WorkBook, grid: Grid): ReportKind => {
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

export const parseWorkbook = async (data: ArrayBuffer): Promise<ParsedReport> => {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(data, { type: "array", cellDates: true });
  if (!wb.SheetNames.length) throw new Error("В файле нет листов");
  const first = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(first, {
    header: 1,
    raw: true,
    defval: null,
  });
  const kind = detectKind(wb, grid);
  if (kind === "transcript") return parseTranscript(wb, XLSX);
  if (kind === "payments") return parsePayments(grid);
  return parseOrders(grid);
};

export const formatRub = rub;
