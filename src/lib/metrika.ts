const COUNTER_ID = 112965538;

type Ym = (id: number, action: string, target?: string, params?: unknown) => void;

export const reachGoal = (goal: string, params?: Record<string, unknown>) => {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (typeof ym !== "function") return;
  try {
    ym(COUNTER_ID, "reachGoal", goal, params);
  } catch {
    /* noop */
  }
};

// Свои сотрудники (вход в раздел документов): помечаем посетителя параметром staff,
// чтобы в Метрике отделять свои заходы от клиентов (фильтр «Параметры посетителей → staff»).
const STAFF_KEY = "agg_staff";

export const markStaff = () => {
  try {
    localStorage.setItem(STAFF_KEY, "1");
  } catch {
    /* noop */
  }
  sendStaff();
};

export const sendStaff = () => {
  let on = false;
  try {
    on = localStorage.getItem(STAFF_KEY) === "1";
  } catch {
    /* noop */
  }
  if (!on) return;
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (typeof ym !== "function") return;
  try {
    ym(COUNTER_ID, "userParams", { staff: 1 });
    ym(COUNTER_ID, "params", { staff: 1 });
  } catch {
    /* noop */
  }
};

export default reachGoal;