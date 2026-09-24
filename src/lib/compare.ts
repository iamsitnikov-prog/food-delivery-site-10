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
};

export type ModelResult = {
  label: string;
  commissionRub: number;
  adRub: number;
  deliveryFeeRub: number;
  withheldPerOrder: number;
  payoutPerOrder: number;
  foodCostRub: number;
  packagingRub: number;
  grossPerOrder: number;
  grossPerMonth: number;
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
  diffPerMonth: number;
  diffPerOrder: number;
  winner: "service" | "own" | "equal";
  breakEvenOrders: number | null;
  yandexPerOrder: number;
  ownDeliveryLabel: string;
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
    label: string,
    commissionShare: number,
    adShare: number,
    deliveryFeeShare: number,
    deliveryCostPerMonth: number,
    paidDeliveryIncome: number,
  ): ModelResult => {
    const commissionRub = pct(commissionShare);
    const adRub = pct(adShare);
    const deliveryFeeRub = pct(deliveryFeeShare);
    const withheldPerOrder = commissionRub + adRub + deliveryFeeRub;
    const payoutPerOrder = avgCheck - withheldPerOrder;
    const grossPerOrder = payoutPerOrder - foodCostRub - packagingRub;
    const grossPerMonth = grossPerOrder * ordersPerMonth;
    const profitPerMonth = grossPerMonth - deliveryCostPerMonth + paidDeliveryIncome;

    return {
      label,
      commissionRub,
      adRub,
      deliveryFeeRub,
      withheldPerOrder,
      payoutPerOrder,
      foodCostRub,
      packagingRub,
      grossPerOrder,
      grossPerMonth,
      deliveryCostPerMonth,
      deliveryCostPerOrder: ordersPerMonth > 0 ? deliveryCostPerMonth / ordersPerMonth : 0,
      paidDeliveryIncome,
      profitPerMonth,
      profitPerOrder: ordersPerMonth > 0 ? profitPerMonth / ordersPerMonth : 0,
      marginPercent: revenuePerMonth > 0 ? (profitPerMonth / revenuePerMonth) * 100 : 0,
    };
  };

  const service = build("Курьеры сервиса", i.serviceCommission, i.serviceAdShare, 0, 0, 0);

  const isStaff = i.ownMode === "staff";

  const salaryFund = clamp(i.courierCount) * clamp(i.courierSalary);
  const insurance = (salaryFund * clamp(i.insuranceRate)) / 100;
  const fuel = i.fuelEnabled ? clamp(i.courierCount) * clamp(i.fuelPerCourier) : 0;
  const staffCost = salaryFund + insurance + fuel;

  const yandexCost = i.yandexKnowOrders
    ? clamp(i.yandexTotal)
    : clamp(i.yandexTotal);
  const yandexPerOrder =
    i.yandexKnowOrders && clamp(i.yandexOrders) > 0
      ? clamp(i.yandexTotal) / clamp(i.yandexOrders)
      : ordersPerMonth > 0
        ? clamp(i.yandexTotal) / ordersPerMonth
        : 0;

  const ownDeliveryCost = isStaff ? staffCost : yandexCost;
  const paidDeliveryIncome =
    isStaff && i.paidDeliveryEnabled ? clamp(i.paidDeliveryTotal) : 0;

  const own = build(
    isStaff ? "Свои курьеры" : "Яндекс Доставка",
    i.ownCommission,
    i.ownAdShare,
    !isStaff && i.yandexButtonFee ? YANDEX_BUTTON_FEE : 0,
    ownDeliveryCost,
    paidDeliveryIncome,
  );

  const diffPerMonth = own.profitPerMonth - service.profitPerMonth;
  const diffPerOrder = ordersPerMonth > 0 ? diffPerMonth / ordersPerMonth : 0;
  const winner: CompareResult["winner"] =
    Math.abs(diffPerMonth) < 1 ? "equal" : diffPerMonth > 0 ? "own" : "service";

  const gapPerOrder = own.grossPerOrder - service.grossPerOrder;
  const fixedOwn = isStaff ? ownDeliveryCost - paidDeliveryIncome : 0;
  const breakEvenOrders =
    isStaff && gapPerOrder > 0 ? Math.ceil(fixedOwn / gapPerOrder / 30) : null;

  return {
    ordersPerMonth,
    revenuePerMonth,
    service,
    own,
    diffPerMonth,
    diffPerOrder,
    winner,
    breakEvenOrders,
    yandexPerOrder,
    ownDeliveryLabel: isStaff ? "Свои курьеры" : "Яндекс Доставка",
  };
};

export { money, percent };
