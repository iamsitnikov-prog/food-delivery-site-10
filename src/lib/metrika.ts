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

export default reachGoal;