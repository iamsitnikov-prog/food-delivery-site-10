import { DEFAULTS, calculate } from "../src/lib/calc";
for (const reach of [100, 50, 25]) {
  const r: any = calculate({ ...DEFAULTS, aggAdReach: reach });
  console.log(`reach=${reach}%  ДРР=${r.drr.toFixed(2)}%  ROMI=${r.romi.toFixed(0)}%`);
}
