export type DeliveryType = "service" | "own";

export type CalcInput = {
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

export const DEFAULTS: CalcInput = {
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
  vat: VatTier;
  vatAmountPerYear: number;
  ordersToVatLimit: number | null;
  daysToVatLimit: number | null;
};

const clamp = (v: number, min = 0) => (Number.isFinite(v) && v > min ? v : min);

export const calculate = (input: CalcInput): CalcResult => {
  const avgCheck = clamp(input.avgCheck);
  const orders = clamp(input.ordersPerDay);
  const pct = (share: number) => (avgCheck * clamp(share)) / 100;

  const commissionRub = pct(input.commission);
  const deliveryFeeRub =
    input.deliveryType === "own" && input.useYandexDelivery ? pct(YANDEX_DELIVERY_FEE) : 0;
  const promoRub = pct(input.promoShare);
  const adRub = pct(input.adShare);
  const marketingRub = pct(input.marketingShare);
  const refundRub = pct(input.refundShare);
  const penaltyRub = pct(input.penaltyShare);
  const foodCostRub = pct(input.foodCost);
  const packagingRub = clamp(input.packaging);

  const totalWithheldRub =
    commissionRub +
    deliveryFeeRub +
    promoRub +
    adRub +
    marketingRub +
    refundRub +
    penaltyRub;
  const withheldPercent = avgCheck > 0 ? (totalWithheldRub / avgCheck) * 100 : 0;

  const payoutPerOrder = avgCheck - totalWithheldRub;
  const payoutPercent = avgCheck > 0 ? (payoutPerOrder / avgCheck) * 100 : 0;

  const profitPerOrder = payoutPerOrder - foodCostRub - packagingRub;
  const marginPercent = avgCheck > 0 ? (profitPerOrder / avgCheck) * 100 : 0;

  const revenuePerDay = avgCheck * orders;
  const revenuePerMonth = revenuePerDay * 30;
  const revenuePerYear = revenuePerDay * 365;
  const payoutPerMonth = payoutPerOrder * orders * 30;

  const profitPerDay = profitPerOrder * orders;
  const fixed = clamp(input.fixedPerMonth);
  const profitPerMonth = profitPerDay * 30 - fixed;

  const adTotalShare = clamp(input.adShare) + clamp(input.marketingShare);
  const drr = adTotalShare;
  const drrVerdict: CalcResult["drrVerdict"] = drr <= 12 ? "good" : drr <= 15 ? "ok" : "bad";
  const adSpendPerMonth = (adRub + marketingRub) * orders * 30;

  const marginBeforeAds =
    avgCheck -
    commissionRub -
    deliveryFeeRub -
    promoRub -
    refundRub -
    penaltyRub -
    foodCostRub -
    packagingRub;
  const drrLimit = avgCheck > 0 ? (marginBeforeAds / avgCheck) * 100 : 0;

  const breakEvenOrders = profitPerOrder > 0 ? Math.ceil(fixed / 30 / profitPerOrder) : 0;

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
    vat,
    vatAmountPerYear,
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