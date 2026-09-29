import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import ChannelCalc from "./ChannelCalc";
import ChannelPicker from "./ChannelPicker";
import {
  AGGREGATORS,
  COMPARISON_ROWS,
  SCENARIOS,
  CONCLUSIONS,
} from "@/data/comparison";

type Filter = "all" | "service" | "own";

const FILTERS: { key: Filter; label: string; note: string }[] = [
  { key: "all", label: "все агрегаторы", note: "Три площадки для приёма заказов" },
  {
    key: "service",
    label: "курьеры сервиса",
    note: "Логистику берёт на себя площадка — комиссия выше",
  },
  {
    key: "own",
    label: "своя доставка",
    note: "Везёте сами, поэтому ставка ниже или её нет совсем",
  },
];

const AggregatorsBlock = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    if (filter === "service")
      return AGGREGATORS.filter(
        (a) => a.commissionCourier !== "нет своих курьеров",
      );
    if (filter === "own")
      return AGGREGATORS.filter((a) => a.commissionSelf !== "нет своих курьеров");
    return AGGREGATORS;
  }, [filter]);

  return (
    <>
      <section className="px-5 pb-10 md:px-14 md:pb-20">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-xl px-4 py-2.5 text-[0.9em] font-medium transition-colors ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "border border-foreground/15 text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="w-full text-[0.85em] leading-snug text-muted-foreground md:w-auto md:pl-2">
            {FILTERS.find((f) => f.key === filter)?.note}
          </span>
        </div>
        <div className="overflow-x-auto rounded-[28px] bg-surface p-2 md:p-4">
          <table className="w-full min-w-[720px] border-collapse text-cream">
            <thead>
              <tr>
                <th className="w-[210px] p-4 text-left align-bottom text-[0.85em] font-normal text-cream-muted">
                  Параметр
                </th>
                {shown.map((a) => (
                  <th key={a.slug} className="p-4 text-left align-bottom">
                    <span className="block font-display text-[1.2em] font-semibold leading-tight">
                      {a.name}
                    </span>
                    <span className="mt-1.5 block text-[0.8em] font-normal leading-snug text-brand">
                      {a.tagline}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key} className="border-t border-cream/12">
                  <th className="p-4 text-left align-top text-[0.9em] font-medium text-cream-muted">
                    {row.label}
                  </th>
                  {shown.map((a) => (
                    <td
                      key={a.slug}
                      className="p-4 align-top text-[0.92em] leading-snug text-cream"
                    >
                      {a[row.key] as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ChannelCalc />

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          сильные и слабые
          <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">стороны</span>
        </h2>
        <div className="mt-8 grid gap-3 md:gap-4 lg:grid-cols-3">
          {AGGREGATORS.map((a) => (
            <article key={a.slug} className="rounded-[28px] bg-surface p-4 text-cream md:p-8">
              <h3 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.02em]">
                {a.name}
              </h3>

              <ul className="mt-5 space-y-2.5">
                {a.strong.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[0.92em] leading-snug">
                    <Icon name="Plus" size={16} className="mt-0.5 shrink-0 text-brand" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-2.5 border-t border-cream/12 pt-5">
                {a.weak.map((s) => (
                  <li
                    key={s}
                    className="flex gap-2.5 text-[0.92em] leading-snug text-cream-muted"
                  >
                    <Icon name="Minus" size={16} className="mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-2xl bg-cream/[0.06] p-4 text-[0.9em] leading-snug">
                <span className="text-brand">Кому подходит. </span>
                {a.bestFor}
              </p>
            </article>
          ))}
        </div>
      </section>

      <ChannelPicker />

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          разборы
          <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">типичных ситуаций</span>
        </h2>
        <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
          {SCENARIOS.map((s) => (
            <article
              key={s.title}
              className="rounded-[28px] border border-foreground/12 p-4 md:p-8"
            >
              <h3 className="font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.situation}</p>
              <p className="mt-4 leading-relaxed">{s.verdict}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[0.9em] font-medium text-foreground">
                <Icon name="Trophy" size={16} />
                {s.winner}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <div className="rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-12">
          <h2 className="font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[44px]">
            выводы
          </h2>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            {CONCLUSIONS.map((c) => (
              <div key={c.h}>
                <h3 className="font-display text-[1.2em] font-semibold text-brand">{c.h}</h3>
                <p className="mt-2.5 leading-relaxed text-cream-muted">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AggregatorsBlock;
