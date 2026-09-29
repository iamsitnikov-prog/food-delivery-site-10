import Icon from "@/components/ui/icon";
import CompareModelCard from "./CompareModelCard";
import { money, type CompareResult } from "@/lib/compare";

const CompareResults = ({ r }: { r: CompareResult }) => {
  const verdict =
    r.winner === "equal"
      ? "Модели равны по деньгам"
      : `${r.best.label} выгоднее на ${money(Math.abs(r.diffPerMonth))} ₽ в месяц`;

  return (
    <div className="space-y-4">
      <div
        className={`rounded-[24px] p-6 ${
          r.winner === "equal" ? "bg-cream/[0.08]" : "bg-brand text-foreground"
        }`}
      >
        <p
          className={`text-[max(12px,0.85em)] font-medium uppercase tracking-wide ${
            r.winner === "equal" ? "text-cream-muted" : "text-foreground/70"
          }`}
        >
          вывод
        </p>
        <p
          className={`mt-2 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.6em] ${
            r.winner === "equal" ? "text-cream" : "text-foreground"
          }`}
        >
          {verdict}
        </p>
        {r.winner !== "equal" && (
          <p className="mt-2 text-[0.95em] leading-snug text-foreground/80">
            Обгоняет «{r.second.label}» на {money(Math.abs(r.diffPerOrder))} ₽ с заказа — это{" "}
            {money(Math.abs(r.diffPerMonth) * 12)} ₽ за год.
          </p>
        )}
        {r.breakEvenOrders !== null && r.breakEvenOrders > 0 && (
          <p
            className={`mt-3 flex gap-2 rounded-xl p-3 text-[max(12px,0.88em)] leading-snug ${
              r.winner === "equal" ? "bg-brand/15 text-cream" : "bg-foreground/10 text-foreground"
            }`}
          >
            <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
            Свои курьеры окупаются от {money(r.breakEvenOrders)} заказов в день. Ниже этого объёма
            выгоднее отдавать доставку сервису.
          </p>
        )}
      </div>

      <CompareModelCard m={r.service} icon="Truck" isWinner={r.winner === "service"} />
      <CompareModelCard m={r.own} icon="Bike" isWinner={r.winner === "own"} />
      {r.hybrid && (
        <CompareModelCard m={r.hybrid} icon="Shuffle" isWinner={r.winner === "hybrid"} />
      )}
    </div>
  );
};

export default CompareResults;
