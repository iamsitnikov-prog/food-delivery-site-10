import { money, percent } from "./calc";

export type OwnMode = "staff" | "yandex";

export type CompareInput = {
  avgCheck: number;
  ordersPerDay: number;
  foodCost: number;
  packaging: number;

  serviceCommission: number;
  serviceAdShare: number;

  ownCommission: number;
  ownAdShare: number;
  ownMode: OwnMode;

  courierCount: number;
  courierSalary: number;
  fuelEnabled: boolean;
  fuelPerCourier: number;
  insuranceRate: number;

  yandexKnowOrders: boolean;
  yandexOrders: number;
  yandexTotal: number;
  yandexButtonFee: boolean;

  paidDeliveryEnabled: boolean;
  paidDeliveryTotal: number;

  hybridEnabled: boolean;
  hybridCourierCount: number;
  hybridOwnShare: number;
};

export const DEFAULT_COMPARE: CompareInput = {
  avgCheck: 1200,
  ordersPerDay: 25,
  foodCost: 30,
  packaging: 60,

  serviceCommission: 35,
  serviceAdShare: 15,

  ownCommission: 20,
  ownAdShare: 15,
  ownMode: "staff",

  courierCount: 2,
  courierSalary: 55000,
  fuelEnabled: true,
  fuelPerCourier: 8000,
  insuranceRate: 30,

  yandexKnowOrders: true,
  yandexOrders: 750,
  yandexTotal: 150000,
  yandexButtonFee: true,

  paidDeliveryEnabled: false,
  paidDeliveryTotal: 0,

  hybridEnabled: true,
  hybridCourierCount: 1,
  hybridOwnShare: 70,
};

export type ModelResult = {
  key: "service" | "own" | "hybrid";
  label: string;
  note?: string;
  commissionRub: number;
  adRub: number;
  deliveryFeeRub: number;
  withheldPerOrder: number;
  payoutPerOrder: number;
  foodCostRub: number;
  packagingRub: number;
  grossPerOrder: number;
  grossPerMonth: number;
  staffCost: number;
  yandexCost: number;
  deliveryCostPerMonth: number;
  deliveryCostPerOrder: number;
  paidDeliveryIncome: number;
  profitPerMonth: number;
  profitPerOrder: number;
  marginPercent: number;
};

export type CompareResult = {
  ordersPerMonth: number;
  revenuePerMonth: number;
  service: ModelResult;
  own: ModelResult;
  hybrid: ModelResult | null;
  models: ModelResult[];
  best: ModelResult;
  second: ModelResult;
  diffPerMonth: number;
  diffPerOrder: number;
  winner: "service" | "own" | "hybrid" | "equal";
  breakEvenOrders: number | null;
  yandexPerOrder: number;
  ownDeliveryLabel: string;
  hybridOwnOrders: number;
  hybridYandexOrders: number;
};

const clamp = (v: number, min = 0) => (Number.isFinite(v) && v > min ? v : min);

export const YANDEX_BUTTON_FEE = 2;

export const calculateCompare = (i: CompareInput): CompareResult => {
  const avgCheck = clamp(i.avgCheck);
  const orders = clamp(i.ordersPerDay);
  const ordersPerMonth = orders * 30;
  const revenuePerMonth = avgCheck * ordersPerMonth;

  const pct = (share: number) => (avgCheck * clamp(share)) / 100;
  const foodCostRub = pct(i.foodCost);
  const packagingRub = clamp(i.packaging);

  const build = (
    key: ModelResult["key"],
    label: string,
    commissionShare: number,
    adShare: number,
    deliveryFeeRubValue: number,
    staffCost: number,
    yandexCost: number,
    paidDeliveryIncome: number,
    note?: string,
  ): ModelResult => {
    const commissionRub = pct(commissionShare);
    const adRub = pct(adShare);
    const withheldPerOrder = commissionRub + adRub + deliveryFeeRubValue;
    const payoutPerOrder = avgCheck - withheldPerOrder;
    const grossPerOrder = payoutPerOrder - foodCostRub - packagingRub;
    const grossPerMonth = grossPerOrder * ordersPerMonth;
    const deliveryCostPerMonth = staffCost + yandexCost;
    const profitPerMonth = grossPerMonth - deliveryCostPerMonth + paidDeliveryIncome;

    return {
      key,
      label,
      note,
      commissionRub,
      adRub,
      deliveryFeeRub: deliveryFeeRubValue,
      withheldPerOrder,
      payoutPerOrder,
      foodCostRub,
      packagingRub,
      grossPerOrder,
      grossPerMonth,
      staffCost,
      yandexCost,
      deliveryCostPerMonth,
      deliveryCostPerOrder: ordersPerMonth > 0 ? deliveryCostPerMonth / ordersPerMonth : 0,
      paidDeliveryIncome,
      profitPerMonth,
      profitPerOrder: ordersPerMonth > 0 ? profitPerMonth / ordersPerMonth : 0,
      marginPercent: revenuePerMonth > 0 ? (profitPerMonth / revenuePerMonth) * 100 : 0,
    };
  };

  const service = build(
    "service",
    "Курьеры сервиса",
    i.serviceCommission,
    i.serviceAdShare,
    0,
    0,
    0,
    0,
    "Комиссия выше, но своих расходов нет",
  );

  const isStaff = i.ownMode === "staff";

  const salaryPerCourier =
    clamp(i.courierSalary) * (1 + clamp(i.insuranceRate) / 100) +
    (i.fuelEnabled ? clamp(i.fuelPerCourier) : 0);
  const staffCostFull = clamp(i.courierCount) * salaryPerCourier;

  const yandexPerOrder =
    i.yandexKnowOrders && clamp(i.yandexOrders) > 0
      ? clamp(i.yandexTotal) / clamp(i.yandexOrders)
      : ordersPerMonth > 0
        ? clamp(i.yandexTotal) / ordersPerMonth
        : 0;

  const paidDeliveryIncome =
    isStaff && i.paidDeliveryEnabled ? clamp(i.paidDeliveryTotal) : 0;

  const own = build(
    "own",
    isStaff ? "Свои курьеры" : "Яндекс Доставка",
    i.ownCommission,
    i.ownAdShare,
    !isStaff && i.yandexButtonFee ? pct(YANDEX_BUTTON_FEE) : 0,
    isStaff ? staffCostFull : 0,
    isStaff ? 0 : clamp(i.yandexTotal),
    paidDeliveryIncome,
    isStaff ? "Низкая комиссия, но зарплаты постоянны" : "Платите только за фактические заказы",
  );

  const ownShare = Math.min(Math.max(clamp(i.hybridOwnShare), 0), 100);
  const hybridOwnOrders = Math.round((ordersPerMonth * ownShare) / 100);
  const hybridYandexOrders = ordersPerMonth - hybridOwnOrders;

  const hybridStaffCost = clamp(i.hybridCourierCount) * salaryPerCourier;
  const hybridYandexCost = hybridYandexOrders * yandexPerOrder;
  const hybridButtonFee =
    i.yandexButtonFee && ordersPerMonth > 0
      ? (pct(YANDEX_BUTTON_FEE) * hybridYandexOrders) / ordersPerMonth
      : 0;
  const hybridPaidIncome = i.paidDeliveryEnabled
    ? (clamp(i.paidDeliveryTotal) * ownShare) / 100
    : 0;

  const hybrid = i.hybridEnabled
    ? build(
        "hybrid",
        "Гибрид",
        i.ownCommission,
        i.ownAdShare,
        hybridButtonFee,
        hybridStaffCost,
        hybridYandexCost,
        hybridPaidIncome,
        `${ownShare}% своими курьерами, остальное — Яндекс Доставка`,
      )
    : null;

  const models = [service, own, ...(hybrid ? [hybrid] : [])];
  const sorted = [...models].sort((a, b) => b.profitPerMonth - a.profitPerMonth);
  const best = sorted[0];
  const second = sorted[1] ?? sorted[0];

  const diffPerMonth = best.profitPerMonth - second.profitPerMonth;
  const diffPerOrder = ordersPerMonth > 0 ? diffPerMonth / ordersPerMonth : 0;
  const winner: CompareResult["winner"] = Math.abs(diffPerMonth) < 1 ? "equal" : best.key;

  const gapPerOrder = own.grossPerOrder - service.grossPerOrder;
  const fixedOwn = isStaff ? staffCostFull - paidDeliveryIncome : 0;
  const breakEvenOrders =
    isStaff && gapPerOrder > 0 ? Math.ceil(fixedOwn / gapPerOrder / 30) : null;

  return {
    ordersPerMonth,
    revenuePerMonth,
    service,
    own,
    hybrid,
    models,
    best,
    second,
    diffPerMonth,
    diffPerOrder,
    winner,
    breakEvenOrders,
    yandexPerOrder,
    ownDeliveryLabel: isStaff ? "Свои курьеры" : "Яндекс Доставка",
    hybridOwnOrders,
    hybridYandexOrders,
  };
};

export { money, percent };
