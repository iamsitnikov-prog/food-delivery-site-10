export type DeliveryType = "service" | "own";

export type TaxMode = "usn6" | "usn15" | "patent" | "osno" | "none";

export type Channel = "aggregator" | "self";

export type FeeOwner = "restaurant" | "courier";

export type Unit = "percent" | "rub";

export type CalcInput = {
  channel: Channel;
  selfCommission: number;
  serviceFeeEnabled: boolean;
  serviceFee: number;
  serviceFeeUnit: Unit;
  deliveryPriceEnabled: boolean;
  deliveryPrice: number;
  deliveryPriceOwner: FeeOwner;
  commissionUnit: Unit;
  adUnit: Unit;
  promoUnit: Unit;
  foodCostUnit: Unit;
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
  taxMode: TaxMode;
  patentCost: number;
  avgCheck: number;
  ordersPerDay: number;
  deliveryType: DeliveryType;
  commission: number;
  useYandexDelivery: boolean;
  promoShare: number;
  adShare: number;
  marketingShare: number;
  refundShare: number;
  penaltyShare: number;
  foodCost: number;
  packaging: number;
  fixedPerMonth: number;
};

export const COMMISSION_SERVICE = 35;
export const COMMISSION_OWN = 20;
export const YANDEX_DELIVERY_FEE = 2;
export const MARKETING_OPTIONS = [0, 2, 5];
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
  channel: "aggregator",
  selfCommission: 0,
  serviceFeeEnabled: false,
  serviceFee: 0,
  serviceFeeUnit: "rub",
  deliveryPriceEnabled: false,
  deliveryPrice: 0,
  deliveryPriceOwner: "restaurant",
  commissionUnit: "percent",
  adUnit: "percent",
  promoUnit: "percent",
  foodCostUnit: "percent",
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
  taxMode: "usn6",
  patentCost: 5000,
  avgCheck: 1200,
  ordersPerDay: 25,
  deliveryType: "service",
  commission: COMMISSION_SERVICE,
  useYandexDelivery: false,
  promoShare: 0,
  adShare: 15,
  marketingShare: 0,
  refundShare: 1,
  penaltyShare: 0.2,
  foodCost: 30,
  packaging: 60,
  fixedPerMonth: 0,
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

export type CalcResult = {
  serviceFeeRub: number;
  deliveryPriceRub: number;
  guestPaysTotal: number;
  restaurantIncome: number;
  overheadCost: number;
  overheadPerOrder: number;
  commissionRub: number;
  deliveryFeeRub: number;
  promoRub: number;
  adRub: number;
  marketingRub: number;
  refundRub: number;
  penaltyRub: number;
  foodCostRub: number;
  packagingRub: number;
  totalWithheldRub: number;
  withheldPercent: number;
  payoutPerOrder: number;
  payoutPercent: number;
  payoutPerMonth: number;
  profitPerOrder: number;
  marginPercent: number;
  revenuePerDay: number;
  revenuePerMonth: number;
  revenuePerYear: number;
  profitPerDay: number;
  profitPerMonth: number;
  drr: number;
  drrVerdict: "good" | "ok" | "bad";
  drrLimit: number;
  adSpendPerMonth: number;
  breakEvenOrders: number;
  isProfitable: boolean;
  managersCost: number;
  couriersCost: number;
  fuelCost: number;
  packersCost: number;
  salaryFund: number;
  insuranceCost: number;
  staffTotal: number;
  staffPerOrder: number;
  profitBeforeTax: number;
  taxAmount: number;
  taxLabel: string;
  taxNote: string;
  netProfitPerMonth: number;
  netMarginPercent: number;
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

const clamp = (v: number, min = 0) => (Number.isFinite(v) && v > min ? v : min);

export const calculate = (input: CalcInput): CalcResult => {
  const avgCheck = clamp(input.avgCheck);
  const orders = clamp(input.ordersPerDay);
  const pct = (share: number) => (avgCheck * clamp(share)) / 100;
  const amount = (value: number, unit: Unit) =>
    unit === "rub" ? clamp(value) : pct(value);

  const isAgg = input.channel === "aggregator";

  const serviceFeeRub = input.serviceFeeEnabled
    ? amount(input.serviceFee, input.serviceFeeUnit)
    : 0;
  const deliveryPriceRub = input.deliveryPriceEnabled ? clamp(input.deliveryPrice) : 0;
  const deliveryToRestaurant =
    input.deliveryPriceEnabled && input.deliveryPriceOwner === "restaurant"
      ? deliveryPriceRub
      : 0;

  const guestPaysTotal = avgCheck + serviceFeeRub + deliveryPriceRub;
  const restaurantIncome = avgCheck + serviceFeeRub + deliveryToRestaurant;

  const commissionRub = isAgg
    ? amount(input.commission, input.commissionUnit)
    : pct(input.selfCommission);
  const deliveryFeeRub =
    isAgg && input.deliveryType === "own" && input.useYandexDelivery
      ? pct(YANDEX_DELIVERY_FEE)
      : 0;
  const promoRub = amount(input.promoShare, input.promoUnit);
  const adRub = amount(input.adShare, input.adUnit);
  const marketingRub = isAgg ? pct(input.marketingShare) : 0;
  const refundRub = pct(input.refundShare);
  const penaltyRub = isAgg ? pct(input.penaltyShare) : 0;
  const foodCostRub = amount(input.foodCost, input.foodCostUnit);
  const packagingRub = clamp(input.packaging);

  const totalWithheldRub =
    commissionRub +
    deliveryFeeRub +
    promoRub +
    adRub +
    marketingRub +
    refundRub +
    penaltyRub;
  const withheldPercent =
    restaurantIncome > 0 ? (totalWithheldRub / restaurantIncome) * 100 : 0;

  const payoutPerOrder = restaurantIncome - totalWithheldRub;
  const payoutPercent = restaurantIncome > 0 ? (payoutPerOrder / restaurantIncome) * 100 : 0;

  const profitPerOrder = payoutPerOrder - foodCostRub - packagingRub;
  const marginPercent = restaurantIncome > 0 ? (profitPerOrder / restaurantIncome) * 100 : 0;

  const revenuePerDay = restaurantIncome * orders;
  const revenuePerMonth = revenuePerDay * 30;
  const revenuePerYear = revenuePerDay * 365;
  const payoutPerMonth = payoutPerOrder * orders * 30;

  const overheadCost = input.overheadEnabled
    ? (clamp(input.overheadTotal) * clamp(input.overheadShare)) / 100
    : 0;

  const on = input.staffEnabled;
  const managersCost = on ? clamp(input.managerCount) * clamp(input.managerSalary) : 0;
  const couriersCost = on ? clamp(input.courierCount) * clamp(input.courierSalary) : 0;
  const fuelCost = on ? clamp(input.courierCount) * clamp(input.fuelPerCourier) : 0;
  const packersCost = on ? clamp(input.packerCount) * clamp(input.packerSalary) : 0;
  const salaryFund = managersCost + couriersCost + packersCost;
  const insuranceCost = (salaryFund * clamp(input.insuranceRate)) / 100;
  const staffTotal = salaryFund + insuranceCost + fuelCost;
  const ordersPerMonth = orders * 30;
  const staffPerOrder = ordersPerMonth > 0 ? staffTotal / ordersPerMonth : 0;
  const overheadPerOrder = ordersPerMonth > 0 ? overheadCost / ordersPerMonth : 0;

  const profitPerDay = profitPerOrder * orders;
  const fixed = clamp(input.fixedPerMonth);
  const profitPerMonth = profitPerDay * 30 - fixed - staffTotal - overheadCost;

  const drr = restaurantIncome > 0 ? ((adRub + marketingRub) / restaurantIncome) * 100 : 0;
  const drrVerdict: CalcResult["drrVerdict"] = drr <= 12 ? "good" : drr <= 15 ? "ok" : "bad";
  const adSpendPerMonth = (adRub + marketingRub) * orders * 30;

  const marginBeforeAds =
    restaurantIncome -
    commissionRub -
    deliveryFeeRub -
    promoRub -
    refundRub -
    penaltyRub -
    foodCostRub -
    packagingRub;
  const drrLimit = restaurantIncome > 0 ? (marginBeforeAds / restaurantIncome) * 100 : 0;

  const breakEvenOrders =
    profitPerOrder > 0 ? Math.ceil((fixed + staffTotal + overheadCost) / 30 / profitPerOrder) : 0;

  const profitBeforeTax = profitPerMonth;
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

  const vat = getVatTier(revenuePerYear);
  const vatAmountPerYear =
    vat.rate > 0 ? (revenuePerYear * vat.rate) / (100 + vat.rate) : 0;

  const remaining = VAT_FREE_LIMIT - revenuePerYear;
  const ordersToVatLimit =
    remaining > 0 && avgCheck > 0 ? Math.floor(remaining / avgCheck) : null;
  const daysToVatLimit =
    revenuePerDay > 0 && revenuePerYear > VAT_FREE_LIMIT
      ? Math.floor(VAT_FREE_LIMIT / revenuePerDay)
      : null;

  return {
    commissionRub,
    deliveryFeeRub,
    promoRub,
    adRub,
    marketingRub,
    refundRub,
    penaltyRub,
    foodCostRub,
    packagingRub,
    totalWithheldRub,
    withheldPercent,
    payoutPerOrder,
    payoutPercent,
    payoutPerMonth,
    profitPerOrder,
    marginPercent,
    revenuePerDay,
    revenuePerMonth,
    revenuePerYear,
    profitPerDay,
    profitPerMonth,
    drr,
    drrVerdict,
    drrLimit,
    adSpendPerMonth,
    breakEvenOrders,
    isProfitable: profitPerOrder > 0,
    serviceFeeRub,
    deliveryPriceRub,
    guestPaysTotal,
    restaurantIncome,
    overheadCost,
    overheadPerOrder,
    managersCost,
    couriersCost,
    fuelCost,
    packersCost,
    salaryFund,
    insuranceCost,
    staffTotal,
    staffPerOrder,
    profitBeforeTax,
    taxAmount,
    taxLabel,
    taxNote,
    netProfitPerMonth,
    netMarginPercent,
    vat,
    vatAmountPerYear,
    ordersToVatLimit,
    daysToVatLimit,
  };
};


export const percent = (v: number, digits = 1) =>
  `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(v)}%`;