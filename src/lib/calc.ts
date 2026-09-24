export type CalcInput = {
  avgCheck: number;
  ordersPerDay: number;
  commission: number;
  promoShare: number;
  adSpendPerDay: number;
  foodCost: number;
  packaging: number;
  fixedPerMonth: number;
};

export const DEFAULTS: CalcInput = {
  avgCheck: 1200,
  ordersPerDay: 25,
  commission: 30,
  promoShare: 10,
  adSpendPerDay: 1500,
  foodCost: 30,
  packaging: 60,
  fixedPerMonth: 0,
};

export const VAT_FREE_LIMIT = 20_000_000;
export const VAT_5_LIMIT = 272_500_000;
export const VAT_7_LIMIT = 490_500_000;

export type VatTier = {
  rate: number;
  label: string;
  note: string;
};

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
  commissionRub: number;
  promoRub: number;
  foodCostRub: number;
  packagingRub: number;
  adPerOrder: number;
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
  breakEvenOrders: number;
  isProfitable: boolean;
  vat: VatTier;
  vatAmountPerYear: number;
  profitAfterVat: number;
  ordersToVatLimit: number | null;
  daysToVatLimit: number | null;
};

const clamp = (v: number, min = 0) => (Number.isFinite(v) && v > min ? v : min);

export const calculate = (input: CalcInput): CalcResult => {
  const avgCheck = clamp(input.avgCheck);
  const orders = clamp(input.ordersPerDay);

  const commissionRub = (avgCheck * clamp(input.commission)) / 100;
  const promoRub = (avgCheck * clamp(input.promoShare)) / 100;
  const foodCostRub = (avgCheck * clamp(input.foodCost)) / 100;
  const packagingRub = clamp(input.packaging);
  const adPerOrder = orders > 0 ? clamp(input.adSpendPerDay) / orders : 0;

  const profitPerOrder =
    avgCheck - commissionRub - promoRub - foodCostRub - packagingRub - adPerOrder;
  const marginPercent = avgCheck > 0 ? (profitPerOrder / avgCheck) * 100 : 0;

  const revenuePerDay = avgCheck * orders;
  const revenuePerMonth = revenuePerDay * 30;
  const revenuePerYear = revenuePerDay * 365;

  const profitPerDay = profitPerOrder * orders;
  const fixed = clamp(input.fixedPerMonth);
  const profitPerMonth = profitPerDay * 30 - fixed;

  const drr = revenuePerDay > 0 ? (clamp(input.adSpendPerDay) / revenuePerDay) * 100 : 0;
  const drrVerdict: CalcResult["drrVerdict"] = drr <= 12 ? "good" : drr <= 15 ? "ok" : "bad";

  const marginBeforeAds =
    avgCheck - commissionRub - promoRub - foodCostRub - packagingRub;
  const drrLimit = avgCheck > 0 ? (marginBeforeAds / avgCheck) * 100 : 0;

  const breakEvenOrders =
    profitPerOrder > 0 ? Math.ceil(fixed / 30 / profitPerOrder) : 0;

  const vat = getVatTier(revenuePerYear);
  const vatAmountPerYear =
    vat.rate > 0 ? (revenuePerYear * vat.rate) / (100 + vat.rate) : 0;
  const profitAfterVat = profitPerMonth * 12 - vatAmountPerYear;

  const remaining = VAT_FREE_LIMIT - revenuePerYear;
  const ordersToVatLimit =
    remaining > 0 && avgCheck > 0 ? Math.floor(remaining / avgCheck) : null;
  const daysToVatLimit =
    revenuePerDay > 0 && revenuePerYear > VAT_FREE_LIMIT
      ? Math.floor(VAT_FREE_LIMIT / revenuePerDay)
      : null;

  return {
    commissionRub,
    promoRub,
    foodCostRub,
    packagingRub,
    adPerOrder,
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
    breakEvenOrders,
    isProfitable: profitPerOrder > 0,
    vat,
    vatAmountPerYear,
    profitAfterVat,
    ordersToVatLimit,
    daysToVatLimit,
  };
};

export const money = (v: number, digits = 0) =>
  new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Math.round(v * 10 ** digits) / 10 ** digits);

export const percent = (v: number, digits = 1) =>
  `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(v)}%`;
