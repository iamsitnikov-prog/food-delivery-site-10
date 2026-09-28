export type DeliveryType = "service" | "own";

export type TaxMode = "usn6" | "usn15" | "patent" | "osno" | "none";

export type Unit = "percent" | "rub";

export type CalcInput = {
  aggEnabled: boolean;
  platform: Platform;
  aggOrdersPerDay: number;
  aggAvgCheck: number;
  deliveryType: DeliveryType;
  commission: number;
  commissionUnit: Unit;
  subscriptionPlan: SubscriptionPlan;
  subscriptionShare: number;
  subscriptionUnit: Unit;
  restaurantCount: number;
  useYandexDelivery: boolean;
  marketingShare: number;
  aggAdShare: number;
  aggAdUnit: Unit;
  aggAdBase: AdBase;
  aggAdReach: number;
  aggPromoShare: number;
  aggPromoUnit: Unit;
  refundShare: number;
  refundUnit: Unit;
  penaltyShare: number;
  penaltyUnit: Unit;

  selfEnabled: boolean;
  selfOrdersPerDay: number;
  selfAvgCheck: number;
  selfCommission: number;
  selfCommissionUnit: Unit;
  serviceFeeEnabled: boolean;
  serviceFee: number;
  serviceFeeUnit: Unit;
  selfAdShare: number;
  selfAdUnit: Unit;
  selfPromoShare: number;
  selfPromoUnit: Unit;
  royaltyShare: number;
  royaltyUnit: Unit;

  foodCost: number;
  foodCostUnit: Unit;
  packaging: number;
  suppliesPerOrder: number;
  writeOffShare: number;
  writeOffUnit: Unit;

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
  periodMonth: number;
  periodYear: number;
};

export const MONTHS = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

export const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

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

export type Platform = "eda" | "ultima";

export const PLATFORMS: { value: Platform; label: string; hint: string }[] = [
  {
    value: "eda",
    label: "Яндекс Еда",
    hint: "Обычная витрина Яндекс Еды. Комиссия по договору, маркетинговые услуги Ultima не применяются.",
  },
  {
    value: "ultima",
    label: "Ultima.Еда",
    hint: "Отдельная витрина для ресторанов премиального сегмента. Дополнительно оплачиваются маркетинговые услуги сервиса — 2% или 5% от заказа на выбор ресторана.",
  },
];

export type AdBase = "all" | "promoted";

export const AD_BASES: { value: AdBase; label: string; hint: string }[] = [
  {
    value: "promoted",
    label: "С заказов по рекламе",
    hint: "Так работает продвижение с оплатой за заказы: ставка списывается только с тех заказов, которые пришли из платной выдачи. Укажите ниже, какую долю всех заказов они составляют.",
  },
  {
    value: "all",
    label: "От всей выручки",
    hint: "Считать ставку от каждого заказа канала. Подходит, если вы знаете только итоговую сумму расходов на продвижение за месяц и её долю в общей выручке.",
  },
];

export type SubscriptionPlan = "none" | "standard" | "business";

// Подписка стоит 1,64% от суммы заказов ПЛЮС НДС: площадка выставляет
// его сверху как за обычную услугу. В расчёт закладываем сумму с НДС,
// иначе расходы занижаются примерно на 3 000 руб. в месяц при выручке 900 000.
export const SUBSCRIPTION_RATE_NET = 1.64;
export const SUBSCRIPTION_VAT_RATE = 22;
export const SUBSCRIPTION_RATE =
  Math.round(SUBSCRIPTION_RATE_NET * (1 + SUBSCRIPTION_VAT_RATE / 100) * 10000) / 10000;
// Фиксированная часть тарифа «Бизнес» — тоже плюс НДС.
const withVat = (net: number) =>
  Math.round(net * (1 + SUBSCRIPTION_VAT_RATE / 100));
export const BUSINESS_BASE_FEE_NET = 1333;
export const BUSINESS_EXTRA_FEE_NET = 583;
export const BUSINESS_BASE_FEE = withVat(BUSINESS_BASE_FEE_NET);
export const BUSINESS_EXTRA_FEE = withVat(BUSINESS_EXTRA_FEE_NET);
export const BUSINESS_BASE_COUNT = 3;

export const SUBSCRIPTION_PLANS: {
  value: SubscriptionPlan;
  label: string;
  hint: string;
}[] = [
  { value: "none", label: "Нет", hint: "Подписка не подключена — инструменты лояльности, отзывов и аналитики недоступны." },
  {
    value: "standard",
    label: "Стандарт",
    hint: "1,64% + НДС от месячной суммы заказов — в расчёте 2,0% с НДС. Ежедневные выплаты, программа лояльности, ответы на отзывы, аналитика конкурентов, отчёты в мессенджере.",
  },
  {
    value: "business",
    label: "Бизнес",
    hint: "1,64% + НДС от суммы заказов (в расчёте 2,0%) плюс фиксированная часть: 1 333 ₽ + НДС за первые три ресторана и 583 ₽ + НДС за каждый следующий. Добавляется личный менеджер.",
  },
];

export const businessFixedFee = (restaurants: number): number => {
  const n = Math.max(1, Math.round(restaurants || 1));
  return BUSINESS_BASE_FEE + Math.max(0, n - BUSINESS_BASE_COUNT) * BUSINESS_EXTRA_FEE;
};

export const DEFAULTS: CalcInput = {
  aggEnabled: true,
  platform: "eda",
  aggOrdersPerDay: 25,
  aggAvgCheck: 1200,
  deliveryType: "service",
  commission: COMMISSION_SERVICE,
  commissionUnit: "percent",
  subscriptionPlan: "standard",
  subscriptionShare: SUBSCRIPTION_RATE,
  subscriptionUnit: "percent",
  restaurantCount: 1,
  useYandexDelivery: false,
  marketingShare: 0,
  aggAdShare: 15,
  aggAdUnit: "percent",
  aggAdBase: "promoted",
  aggAdReach: 100,
  aggPromoShare: 0,
  aggPromoUnit: "percent",
  refundShare: 1,
  refundUnit: "percent",
  penaltyShare: 0.2,
  penaltyUnit: "percent",

  selfEnabled: false,
  selfOrdersPerDay: 10,
  selfAvgCheck: 1400,
  selfCommission: 0,
  selfCommissionUnit: "percent",
  serviceFeeEnabled: false,
  serviceFee: 0,
  serviceFeeUnit: "rub",
  selfAdShare: 5,
  selfAdUnit: "percent",
  selfPromoShare: 0,
  selfPromoUnit: "percent",
  royaltyShare: 0,
  royaltyUnit: "percent",

  foodCost: 30,
  foodCostUnit: "percent",
  packaging: 60,
  suppliesPerOrder: 20,
  writeOffShare: 0,
  writeOffUnit: "percent",

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
  periodMonth: new Date().getMonth(),
  periodYear: new Date().getFullYear(),

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
  subscriptionFixedPerMonth: number;
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
  adRevenuePerMonth: number;
  adProfitPerMonth: number;
  adCostPerMonth: number;
  drr: number;
  drrLimit: number;
  romi: number;
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
  romi: number;
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
  subscriptionFixedPerMonth: 0,
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
  adRevenuePerMonth: 0,
  adProfitPerMonth: 0,
  adCostPerMonth: 0,
  drr: 0,
  drrLimit: 0,
  romi: 0,
};

type ChannelParams = {
  enabled: boolean;
  orders: number;
  avgCheck: number;
  serviceFeeRub?: number;
  commission: number;
  commissionUnit?: Unit;
  subscriptionShare?: number;
  subscriptionUnit?: Unit;
  subscriptionFixedPerMonth?: number;
  deliveryFeeShare?: number;
  adShare: number;
  adUnit?: Unit;
  adReach?: number;
  promoShare: number;
  promoUnit?: Unit;
  marketingShare?: number;
  refundShare?: number;
  refundUnit?: Unit;
  penaltyShare?: number;
  penaltyUnit?: Unit;
  royaltyShare?: number;
  royaltyUnit?: Unit;
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
  const days = daysInMonth(shared.periodMonth, shared.periodYear);
  const ordersPerMonthRaw = clamp(p.orders) * days;
  const subscriptionFixedPerMonth = clamp(p.subscriptionFixedPerMonth ?? 0);
  const subscriptionFixedPerOrder =
    ordersPerMonthRaw > 0 ? subscriptionFixedPerMonth / ordersPerMonthRaw : 0;
  const subscriptionRub =
    amount(p.subscriptionShare ?? 0, p.subscriptionUnit) + subscriptionFixedPerOrder;
  const deliveryFeeRub = pct(p.deliveryFeeShare ?? 0);
  const adReachFactor = Math.min(100, Math.max(0, p.adReach ?? 100)) / 100;
  const adRub = amount(p.adShare, p.adUnit) * adReachFactor;
  const promoRub = amount(p.promoShare, p.promoUnit);
  const marketingRub = pct(p.marketingShare ?? 0);
  const refundRub = amount(p.refundShare ?? 0, p.refundUnit);
  const penaltyRub = amount(p.penaltyShare ?? 0, p.penaltyUnit);
  const royaltyRub =
    p.royaltyUnit === "rub"
      ? clamp(p.royaltyShare ?? 0)
      : (income * clamp(p.royaltyShare ?? 0)) / 100;

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
  const writeOffRub =
    shared.writeOffUnit === "rub"
      ? clamp(shared.writeOffShare)
      : (avgCheck * clamp(shared.writeOffShare)) / 100;

  const profitPerOrder =
    payoutPerOrder - foodCostRub - packagingRub - suppliesRub - writeOffRub - royaltyRub;
  const marginPercent = income > 0 ? (profitPerOrder / income) * 100 : 0;

  const ordersPerMonth = orders * days;
  const revenuePerMonth = income * ordersPerMonth;
  const payoutPerMonth = payoutPerOrder * ordersPerMonth;
  const profitPerMonth = profitPerOrder * ordersPerMonth;
  const adSpendPerMonth = (adRub + marketingRub + promoRub) * ordersPerMonth;

  // ДРР и ROMI считаем по экономике РЕКЛАМНОГО заказа, а не «в среднем по всем».
  //
  // Тонкость: adRub — это ставка, размазанная по всем заказам канала
  // (ставка x доля рекламных заказов). На самом рекламном заказе списывается
  // полная ставка. Поэтому для рекламных показателей берём её целиком.
  const adFullRub = amount(p.adShare, p.adUnit);
  const adSpendPerAdOrder = adFullRub + marketingRub + promoRub;

  const adOrdersPerMonth = ordersPerMonth * adReachFactor;
  const adRevenuePerMonth = income * adOrdersPerMonth;
  const adCostPerMonth = adSpendPerAdOrder * adOrdersPerMonth;
  const drr = income > 0 ? (adSpendPerAdOrder / income) * 100 : 0;

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
  // ROMI: прибыль рекламного заказа делим на расходы на рекламу в нём.
  //
  // Раньше в числителе стояла прибыль ВСЕХ заказов, включая те, что пришли бы
  // и без рекламы, — из-за этого при доле рекламы 25% показатель раздувался
  // до 580%: чем меньше рекламы, тем «выгоднее» она выглядела.
  //
  // profitPerOrder посчитана со средней (размазанной) ставкой, поэтому
  // возвращаем её обратно и вычитаем полную — получаем прибыль именно
  // рекламного заказа. При неизменной ставке ROMI больше не зависит от доли.
  const profitPerAdOrder = profitPerOrder + adRub - adFullRub;
  const adProfitPerMonth = profitPerAdOrder * adOrdersPerMonth;
  const romi = adCostPerMonth > 0 ? (adProfitPerMonth / adCostPerMonth) * 100 : 0;

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
    subscriptionFixedPerMonth,
    revenuePerMonth,
    payoutPerMonth,
    profitPerMonth,
    adSpendPerMonth,
    adRevenuePerMonth,
    adProfitPerMonth,
    adCostPerMonth,
    drr,
    drrLimit,
    romi,
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
      subscriptionShare: input.subscriptionPlan === "none" ? 0 : input.subscriptionShare,
      subscriptionUnit: input.subscriptionUnit,
      subscriptionFixedPerMonth:
        input.subscriptionPlan === "business" ? businessFixedFee(input.restaurantCount) : 0,
      deliveryFeeShare:
        input.deliveryType === "own" && input.useYandexDelivery ? YANDEX_DELIVERY_FEE : 0,
      adShare: input.aggAdShare,
      adUnit: input.aggAdUnit,
      adReach: input.aggAdBase === "promoted" ? input.aggAdReach : 100,
      promoShare: input.aggPromoShare,
      promoUnit: input.aggPromoUnit,
      marketingShare: input.platform === "ultima" ? input.marketingShare : 0,
      refundShare: input.refundShare,
      refundUnit: input.refundUnit,
      penaltyShare: input.penaltyShare,
      penaltyUnit: input.penaltyUnit,
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
      commissionUnit: input.selfCommissionUnit,
      adShare: input.selfAdShare,
      adUnit: input.selfAdUnit,
      promoShare: input.selfPromoShare,
      promoUnit: input.selfPromoUnit,
      royaltyShare: input.royaltyShare,
      royaltyUnit: input.royaltyUnit,
    },
    input,
  );

  const days = daysInMonth(input.periodMonth, input.periodYear);
  const ordersPerDay = agg.orders + self.orders;
  const ordersPerMonth = ordersPerDay * days;
  const revenuePerMonth = agg.revenuePerMonth + self.revenuePerMonth;
  const revenuePerDay = revenuePerMonth / days;
  // Год = 12 месячных выручек, а не 365 дней.
  // Месяц считается по календарным дням выбранного периода, поэтому умножение
  // дневной выручки на 365 давало расхождение: 10,95 млн против 10,8 млн
  // (12 x 900 000). Рядом на странице обе цифры выглядели как ошибка.
  const revenuePerYear = revenuePerMonth * 12;
  const payoutPerMonth = agg.payoutPerMonth + self.payoutPerMonth;
  const grossProfitPerMonth = agg.profitPerMonth + self.profitPerMonth;

  const avgCheck = ordersPerMonth > 0 ? revenuePerMonth / ordersPerMonth : 0;
  const profitPerOrder = ordersPerMonth > 0 ? grossProfitPerMonth / ordersPerMonth : 0;
  const payoutPerOrder = ordersPerMonth > 0 ? payoutPerMonth / ordersPerMonth : 0;
  const marginPercent = revenuePerMonth > 0 ? (grossProfitPerMonth / revenuePerMonth) * 100 : 0;
  const payoutPercent = revenuePerMonth > 0 ? (payoutPerMonth / revenuePerMonth) * 100 : 0;
  const withheldPercent = revenuePerMonth > 0 ? 100 - payoutPercent : 0;

  const adSpendPerMonth = agg.adSpendPerMonth + self.adSpendPerMonth;

  // Сводный ДРР и ROMI — тоже от рекламной выручки и прибыли рекламных
  // заказов (см. computeChannel). Складываем базы по каналам, а не берём
  // всю выручку и всю прибыль.
  const adRevenuePerMonth = agg.adRevenuePerMonth + self.adRevenuePerMonth;
  const adProfitPerMonth = agg.adProfitPerMonth + self.adProfitPerMonth;
  const adCostPerMonth = agg.adCostPerMonth + self.adCostPerMonth;
  const drr = adRevenuePerMonth > 0 ? (adCostPerMonth / adRevenuePerMonth) * 100 : 0;
  const drrVerdict: CalcResult["drrVerdict"] = drr <= 12 ? "good" : drr <= 15 ? "ok" : "bad";
  const romi = adCostPerMonth > 0 ? (adProfitPerMonth / adCostPerMonth) * 100 : 0;
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
    profitPerOrder > 0
      ? Math.ceil((operatingTotal + depreciationCost) / days / profitPerOrder)
      : 0;

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
    romi,
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