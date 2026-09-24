export type DeliveryType = "service" | "own";

export type TaxMode = "usn6" | "usn15" | "patent" | "osno" | "none";

export type Unit = "percent" | "rub";

export type CalcInput = {
  aggEnabled: boolean;
  aggOrdersPerDay: number;
  aggAvgCheck: number;
  deliveryType: DeliveryType;
  commission: number;
  commissionUnit: Unit;
  subscriptionShare: number;
  useYandexDelivery: boolean;
  marketingShare: number;
  aggAdShare: number;
  aggAdUnit: Unit;
  aggPromoShare: number;
  aggPromoUnit: Unit;
  refundShare: number;
  penaltyShare: number;

  selfEnabled: boolean;
  selfOrdersPerDay: number;
  selfAvgCheck: number;
  selfCommission: number;
  serviceFeeEnabled: boolean;
  serviceFee: number;
  serviceFeeUnit: Unit;
  selfAdShare: number;
  selfAdUnit: Unit;
  selfPromoShare: number;
  royaltyShare: number;

  foodCost: number;
  foodCostUnit: Unit;
  packaging: number;
  suppliesPerOrder: number;
  writeOffShare: number;

  overheadEnabled: boolean;
  overheadTotal: number;
  overheadShare: number;
  staffEnabled: boolean;
  managerCount: number;
  managerSalary: number;
  courierCount: number;
  courierSalary: number;
  fuelPerCourier: number;
  packerCount: number;
  packerSalary: number;
  insuranceRate: number;
  fixedPerMonth: number;
  itPerMonth: number;
  depreciationPerMonth: number;
  taxMode: TaxMode;
  patentCost: number;
};

export const COMMISSION_SERVICE = 35;
export const COMMISSION_OWN = 20;
export const YANDEX_DELIVERY_FEE = 2;
export const INSURANCE_RATE_DEFAULT = 30;

export const TAX_MODES: { value: TaxMode; label: string; hint: string }[] = [
  {
    value: "usn6",
    label: "УСН «Доходы» 6%",
    hint: "Налог считается со всего оборота, включая комиссию сервиса. Можно уменьшить на страховые взносы, но не более чем вдвое.",
  },
  {
    value: "usn15",
    label: "УСН «Доходы минус расходы» 15%",
    hint: "Налог с разницы между доходами и расходами. Есть минимальный налог — 1% от дохода, если он выше расчётного.",
  },
  {
    value: "patent",
    label: "Патент",
    hint: "Фиксированная стоимость патента в месяц. Доставка через агрегатор под патент обычно не подпадает — уточните у бухгалтера.",
  },
  {
    value: "osno",
    label: "ОСНО 20%",
    hint: "Налог на прибыль 20% с разницы между доходами и расходами.",
  },
  { value: "none", label: "Не учитывать", hint: "Расчёт без налога на прибыль." },
];

export const DEFAULTS: CalcInput = {
  aggEnabled: true,
  aggOrdersPerDay: 25,
  aggAvgCheck: 1200,
  deliveryType: "service",
  commission: COMMISSION_SERVICE,
  commissionUnit: "percent",
  subscriptionShare: 1.44,
  useYandexDelivery: false,
  marketingShare: 0,
  aggAdShare: 15,
  aggAdUnit: "percent",
  aggPromoShare: 0,
  aggPromoUnit: "percent",
  refundShare: 1,
  penaltyShare: 0.2,

  selfEnabled: false,
  selfOrdersPerDay: 10,
  selfAvgCheck: 1400,
  selfCommission: 0,
  serviceFeeEnabled: false,
  serviceFee: 0,
  serviceFeeUnit: "rub",
  selfAdShare: 5,
  selfAdUnit: "percent",
  selfPromoShare: 0,
  royaltyShare: 0,

  foodCost: 30,
  foodCostUnit: "percent",
  packaging: 60,
  suppliesPerOrder: 20,
  writeOffShare: 0,

  overheadEnabled: false,
  overheadTotal: 0,
  overheadShare: 25,
  staffEnabled: false,
  managerCount: 1,
  managerSalary: 60000,
  courierCount: 2,
  courierSalary: 55000,
  fuelPerCourier: 8000,
  packerCount: 1,
  packerSalary: 45000,
  insuranceRate: INSURANCE_RATE_DEFAULT,
  fixedPerMonth: 0,
  itPerMonth: 0,
  depreciationPerMonth: 0,
  taxMode: "usn6",
  patentCost: 5000,
};

export const VAT_FREE_LIMIT = 20_000_000;
export const VAT_5_LIMIT = 272_500_000;
export const VAT_7_LIMIT = 490_500_000;

export type VatTier = { rate: number; label: string; note: string };

export const getVatTier = (yearRevenue: number): VatTier => {
  if (yearRevenue <= VAT_FREE_LIMIT)
    return {
      rate: 0,
      label: "без НДС",
      note: "Доход в пределах лимита — НДС платить не нужно.",
    };
  if (yearRevenue <= VAT_5_LIMIT)
    return {
      rate: 5,
      label: "5%",
      note: "Пониженная ставка без права на вычет входящего НДС. Можно выбрать 22% с вычетами, если много закупок с НДС.",
    };
  if (yearRevenue <= VAT_7_LIMIT)
    return {
      rate: 7,
      label: "7%",
      note: "Пониженная ставка без права на вычет входящего НДС. Альтернатива — 22% с вычетами.",
    };
  return {
    rate: 22,
    label: "22%",
    note: "Доход превысил лимит для пониженных ставок — применяется общая ставка с правом на вычет.",
  };
};

export type ChannelResult = {
  enabled: boolean;
  orders: number;
  avgCheck: number;
  serviceFeeRub: number;
  income: number;
  commissionRub: number;
  subscriptionRub: number;
  deliveryFeeRub: number;
  adRub: number;
  promoRub: number;
  marketingRub: number;
  refundRub: number;
  penaltyRub: number;
  royaltyRub: number;
  totalWithheldRub: number;
  withheldPercent: number;
  payoutPerOrder: number;
  payoutPercent: number;
  foodCostRub: number;
  packagingRub: number;
  suppliesRub: number;
  writeOffRub: number;
  profitPerOrder: number;
  marginPercent: number;
  revenuePerMonth: number;
  payoutPerMonth: number;
  profitPerMonth: number;
  adSpendPerMonth: number;
  drr: number;
  drrLimit: number;
};

export type CalcResult = {
  agg: ChannelResult;
  self: ChannelResult;
  bothChannels: boolean;
  anyChannel: boolean;
  ordersPerDay: number;
  avgCheck: number;
  revenuePerDay: number;
  revenuePerMonth: number;
  revenuePerYear: number;
  payoutPerMonth: number;
  grossProfitPerMonth: number;
  profitPerOrder: number;
  marginPercent: number;
  payoutPerOrder: number;
  payoutPercent: number;
  withheldPercent: number;
  drr: number;
  drrVerdict: "good" | "ok" | "bad";
  drrLimit: number;
  adSpendPerMonth: number;
  isProfitable: boolean;
  managersCost: number;
  couriersCost: number;
  fuelCost: number;
  packersCost: number;
  salaryFund: number;
  insuranceCost: number;
  staffTotal: number;
  staffPerOrder: number;
  overheadCost: number;
  overheadPerOrder: number;
  itCost: number;
  depreciationCost: number;
  operatingTotal: number;
  ebitda: number;
  ebitdaPercent: number;
  profitBeforeTax: number;
  taxAmount: number;
  taxLabel: string;
  taxNote: string;
  netProfitPerMonth: number;
  netMarginPercent: number;
  breakEvenOrders: number;
  vat: VatTier;
  vatAmountPerYear: number;
  ordersToVatLimit: number | null;
  daysToVatLimit: number | null;
};

export const money = (v: number, digits = 0) =>
  new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
    .format(Math.round(v * 10 ** digits) / 10 ** digits)
    .replace("-", "\u2212");

export const percent = (v: number, digits = 1) =>
  `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
    .format(v)
    .replace("-", "\u2212")}%`;

const clamp = (v: number, min = 0) => (Number.isFinite(v) && v > min ? v : min);

const EMPTY_CHANNEL: ChannelResult = {
  enabled: false,
  orders: 0,
  avgCheck: 0,
  serviceFeeRub: 0,
  income: 0,
  commissionRub: 0,
  subscriptionRub: 0,
  deliveryFeeRub: 0,
  adRub: 0,
  promoRub: 0,
  marketingRub: 0,
  refundRub: 0,
  penaltyRub: 0,
  royaltyRub: 0,
  totalWithheldRub: 0,
  withheldPercent: 0,
  payoutPerOrder: 0,
  payoutPercent: 0,
  foodCostRub: 0,
  packagingRub: 0,
  suppliesRub: 0,
  writeOffRub: 0,
  profitPerOrder: 0,
  marginPercent: 0,
  revenuePerMonth: 0,
  payoutPerMonth: 0,
  profitPerMonth: 0,
  adSpendPerMonth: 0,
  drr: 0,
  drrLimit: 0,
};

type ChannelParams = {
  enabled: boolean;
  orders: number;
  avgCheck: number;
  serviceFeeRub?: number;
  commission: number;
  commissionUnit?: Unit;
  subscriptionShare?: number;
  deliveryFeeShare?: number;
  adShare: number;
  adUnit?: Unit;
  promoShare: number;
  promoUnit?: Unit;
  marketingShare?: number;
  refundShare?: number;
  penaltyShare?: number;
  royaltyShare?: number;
};

const computeChannel = (p: ChannelParams, shared: CalcInput): ChannelResult => {
  if (!p.enabled) return EMPTY_CHANNEL;

  const avgCheck = clamp(p.avgCheck);
  const orders = clamp(p.orders);
  const pct = (share: number) => (avgCheck * clamp(share)) / 100;
  const amount = (value: number, unit: Unit = "percent") =>
    unit === "rub" ? clamp(value) : pct(value);

  const serviceFeeRub = clamp(p.serviceFeeRub ?? 0);
  const income = avgCheck + serviceFeeRub;

  const commissionRub = amount(p.commission, p.commissionUnit);
  const subscriptionRub = pct(p.subscriptionShare ?? 0);
  const deliveryFeeRub = pct(p.deliveryFeeShare ?? 0);
  const adRub = amount(p.adShare, p.adUnit);
  const promoRub = amount(p.promoShare, p.promoUnit);
  const marketingRub = pct(p.marketingShare ?? 0);
  const refundRub = pct(p.refundShare ?? 0);
  const penaltyRub = pct(p.penaltyShare ?? 0);
  const royaltyRub = (income * clamp(p.royaltyShare ?? 0)) / 100;

  const totalWithheldRub =
    commissionRub +
    subscriptionRub +
    deliveryFeeRub +
    adRub +
    promoRub +
    marketingRub +
    refundRub +
    penaltyRub;
  const withheldPercent = income > 0 ? (totalWithheldRub / income) * 100 : 0;

  const payoutPerOrder = income - totalWithheldRub;
  const payoutPercent = income > 0 ? (payoutPerOrder / income) * 100 : 0;

  const foodCostRub =
    shared.foodCostUnit === "rub"
      ? clamp(shared.foodCost)
      : (avgCheck * clamp(shared.foodCost)) / 100;
  const packagingRub = clamp(shared.packaging);
  const suppliesRub = clamp(shared.suppliesPerOrder);
  const writeOffRub = pct(shared.writeOffShare);

  const profitPerOrder =
    payoutPerOrder - foodCostRub - packagingRub - suppliesRub - writeOffRub - royaltyRub;
  const marginPercent = income > 0 ? (profitPerOrder / income) * 100 : 0;

  const ordersPerMonth = orders * 30;
  const revenuePerMonth = income * ordersPerMonth;
  const payoutPerMonth = payoutPerOrder * ordersPerMonth;
  const profitPerMonth = profitPerOrder * ordersPerMonth;
  const adSpendPerMonth = (adRub + marketingRub + promoRub) * ordersPerMonth;
  const drr = income > 0 ? ((adRub + marketingRub + promoRub) / income) * 100 : 0;

  const marginBeforeAds =
    income -
    commissionRub -
    subscriptionRub -
    deliveryFeeRub -
    refundRub -
    penaltyRub -
    royaltyRub -
    foodCostRub -
    packagingRub -
    suppliesRub -
    writeOffRub;
  const drrLimit = income > 0 ? (marginBeforeAds / income) * 100 : 0;

  return {
    enabled: true,
    orders,
    avgCheck,
    serviceFeeRub,
    income,
    commissionRub,
    subscriptionRub,
    deliveryFeeRub,
    adRub,
    promoRub,
    marketingRub,
    refundRub,
    penaltyRub,
    royaltyRub,
    totalWithheldRub,
    withheldPercent,
    payoutPerOrder,
    payoutPercent,
    foodCostRub,
    packagingRub,
    suppliesRub,
    writeOffRub,
    profitPerOrder,
    marginPercent,
    revenuePerMonth,
    payoutPerMonth,
    profitPerMonth,
    adSpendPerMonth,
    drr,
    drrLimit,
  };
};

export const calculate = (input: CalcInput): CalcResult => {
  const aggOn = input.aggEnabled;
  const selfOn = input.selfEnabled;

  const agg = computeChannel(
    {
      enabled: aggOn,
      orders: input.aggOrdersPerDay,
      avgCheck: input.aggAvgCheck,
      commission: input.commission,
      commissionUnit: input.commissionUnit,
      subscriptionShare: input.subscriptionShare,
      deliveryFeeShare:
        input.deliveryType === "own" && input.useYandexDelivery ? YANDEX_DELIVERY_FEE : 0,
      adShare: input.aggAdShare,
      adUnit: input.aggAdUnit,
      promoShare: input.aggPromoShare,
      promoUnit: input.aggPromoUnit,
      marketingShare: input.marketingShare,
      refundShare: input.refundShare,
      penaltyShare: input.penaltyShare,
    },
    input,
  );

  const selfServiceFee = input.serviceFeeEnabled
    ? input.serviceFeeUnit === "rub"
      ? clamp(input.serviceFee)
      : (clamp(input.selfAvgCheck) * clamp(input.serviceFee)) / 100
    : 0;

  const self = computeChannel(
    {
      enabled: selfOn,
      orders: input.selfOrdersPerDay,
      avgCheck: input.selfAvgCheck,
      serviceFeeRub: selfServiceFee,
      commission: input.selfCommission,
      adShare: input.selfAdShare,
      adUnit: input.selfAdUnit,
      promoShare: input.selfPromoShare,
      royaltyShare: input.royaltyShare,
    },
    input,
  );

  const ordersPerDay = agg.orders + self.orders;
  const ordersPerMonth = ordersPerDay * 30;
  const revenuePerMonth = agg.revenuePerMonth + self.revenuePerMonth;
  const revenuePerDay = revenuePerMonth / 30;
  const revenuePerYear = revenuePerDay * 365;
  const payoutPerMonth = agg.payoutPerMonth + self.payoutPerMonth;
  const grossProfitPerMonth = agg.profitPerMonth + self.profitPerMonth;

  const avgCheck = ordersPerMonth > 0 ? revenuePerMonth / ordersPerMonth : 0;
  const profitPerOrder = ordersPerMonth > 0 ? grossProfitPerMonth / ordersPerMonth : 0;
  const payoutPerOrder = ordersPerMonth > 0 ? payoutPerMonth / ordersPerMonth : 0;
  const marginPercent = revenuePerMonth > 0 ? (grossProfitPerMonth / revenuePerMonth) * 100 : 0;
  const payoutPercent = revenuePerMonth > 0 ? (payoutPerMonth / revenuePerMonth) * 100 : 0;
  const withheldPercent = revenuePerMonth > 0 ? 100 - payoutPercent : 0;

  const adSpendPerMonth = agg.adSpendPerMonth + self.adSpendPerMonth;
  const drr = revenuePerMonth > 0 ? (adSpendPerMonth / revenuePerMonth) * 100 : 0;
  const drrVerdict: CalcResult["drrVerdict"] = drr <= 12 ? "good" : drr <= 15 ? "ok" : "bad";
  const drrLimit =
    revenuePerMonth > 0
      ? (agg.drrLimit * agg.revenuePerMonth + self.drrLimit * self.revenuePerMonth) /
        revenuePerMonth
      : 0;

  const on = input.staffEnabled;
  const managersCost = on ? clamp(input.managerCount) * clamp(input.managerSalary) : 0;
  const couriersCost = on ? clamp(input.courierCount) * clamp(input.courierSalary) : 0;
  const fuelCost = on ? clamp(input.courierCount) * clamp(input.fuelPerCourier) : 0;
  const packersCost = on ? clamp(input.packerCount) * clamp(input.packerSalary) : 0;
  const salaryFund = managersCost + couriersCost + packersCost;
  const insuranceCost = (salaryFund * clamp(input.insuranceRate)) / 100;
  const staffTotal = salaryFund + insuranceCost + fuelCost;
  const staffPerOrder = ordersPerMonth > 0 ? staffTotal / ordersPerMonth : 0;

  const overheadCost = input.overheadEnabled
    ? (clamp(input.overheadTotal) * clamp(input.overheadShare)) / 100
    : 0;
  const overheadPerOrder = ordersPerMonth > 0 ? overheadCost / ordersPerMonth : 0;

  const fixed = clamp(input.fixedPerMonth);
  const itCost = clamp(input.itPerMonth);
  const depreciationCost = clamp(input.depreciationPerMonth);
  const operatingTotal = staffTotal + overheadCost + fixed + itCost;

  const ebitda = grossProfitPerMonth - operatingTotal;
  const ebitdaPercent = revenuePerMonth > 0 ? (ebitda / revenuePerMonth) * 100 : 0;
  const profitBeforeTax = ebitda - depreciationCost;

  let taxAmount = 0;
  let taxLabel = "без налога";
  let taxNote = "Налог на прибыль в расчёте не учитывается.";

  if (input.taxMode === "usn6") {
    const raw = revenuePerMonth * 0.06;
    const reduction = Math.min(insuranceCost, raw / 2);
    taxAmount = raw - reduction;
    taxLabel = "УСН 6%";
    taxNote =
      insuranceCost > 0
        ? `Налог считается со всего оборота (${money(revenuePerMonth)} ₽), а не с того, что пришло на счёт. Уменьшен на страховые взносы, но не более чем наполовину.`
        : `Налог считается со всего оборота (${money(revenuePerMonth)} ₽), включая комиссию сервиса, — а не с суммы, поступившей на счёт.`;
  } else if (input.taxMode === "usn15") {
    const base = Math.max(profitBeforeTax, 0);
    const calculated = base * 0.15;
    const minimal = revenuePerMonth * 0.01;
    taxAmount = Math.max(calculated, minimal);
    taxLabel = "УСН 15%";
    taxNote =
      taxAmount === minimal && minimal > calculated
        ? `Расчётный налог ниже минимального, поэтому применяется минимальный налог — 1% от дохода (${money(minimal)} ₽).`
        : "Налог с разницы между доходами и расходами. Учтите: не все расходы можно принять к вычету — уточните у бухгалтера.";
  } else if (input.taxMode === "patent") {
    taxAmount = clamp(input.patentCost);
    taxLabel = "Патент";
    taxNote =
      "Фиксированная стоимость патента. Важно: продажа через агрегатор обычно не подпадает под патент — проверьте применимость с бухгалтером.";
  } else if (input.taxMode === "osno") {
    taxAmount = Math.max(profitBeforeTax, 0) * 0.2;
    taxLabel = "Налог на прибыль 20%";
    taxNote = "Налог на прибыль с разницы между доходами и расходами. НДС считается отдельно.";
  }

  const netProfitPerMonth = profitBeforeTax - taxAmount;
  const netMarginPercent = revenuePerMonth > 0 ? (netProfitPerMonth / revenuePerMonth) * 100 : 0;

  const breakEvenOrders =
    profitPerOrder > 0 ? Math.ceil((operatingTotal + depreciationCost) / 30 / profitPerOrder) : 0;

  const vat = getVatTier(revenuePerYear);
  const vatAmountPerYear = vat.rate > 0 ? (revenuePerYear * vat.rate) / (100 + vat.rate) : 0;

  const remaining = VAT_FREE_LIMIT - revenuePerYear;
  const ordersToVatLimit = remaining > 0 && avgCheck > 0 ? Math.floor(remaining / avgCheck) : null;
  const daysToVatLimit =
    revenuePerDay > 0 && revenuePerYear > VAT_FREE_LIMIT
      ? Math.floor(VAT_FREE_LIMIT / revenuePerDay)
      : null;

  return {
    agg,
    self,
    bothChannels: aggOn && selfOn,
    anyChannel: aggOn || selfOn,
    ordersPerDay,
    avgCheck,
    revenuePerDay,
    revenuePerMonth,
    revenuePerYear,
    payoutPerMonth,
    grossProfitPerMonth,
    profitPerOrder,
    marginPercent,
    payoutPerOrder,
    payoutPercent,
    withheldPercent,
    drr,
    drrVerdict,
    drrLimit,
    adSpendPerMonth,
    isProfitable: profitPerOrder > 0,
    managersCost,
    couriersCost,
    fuelCost,
    packersCost,
    salaryFund,
    insuranceCost,
    staffTotal,
    staffPerOrder,
    overheadCost,
    overheadPerOrder,
    itCost,
    depreciationCost,
    operatingTotal,
    ebitda,
    ebitdaPercent,
    profitBeforeTax,
    taxAmount,
    taxLabel,
    taxNote,
    netProfitPerMonth,
    netMarginPercent,
    breakEvenOrders,
    vat,
    vatAmountPerYear,
    ordersToVatLimit,
    daysToVatLimit,
  };
};
