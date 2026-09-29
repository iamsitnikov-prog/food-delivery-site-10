import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { CityCase } from "@/data/city-cases";
import { getChecklistPage, countItems } from "@/data/checklists";

const CityCaseBlock = ({
  data,
  city,
  inline,
}: {
  data: CityCase;
  city: string;
  inline?: boolean;
}) => {
  const checklist = getChecklistPage(data.checklist);

  return (
  <div
    className={
      inline
        ? "rounded-[28px] border border-cream/20 p-6 text-cream md:p-8"
        : "rounded-[28px] bg-surface p-6 text-cream md:p-10"
    }
  >
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="rounded-lg bg-brand px-3 py-1.5 text-[0.78em] font-bold uppercase tracking-wide text-foreground">
        кейс
      </span>
      <span className="text-[0.85em] text-cream-muted">
        {city} · {data.kind} · {data.period}
      </span>
    </div>

    <h3
      className={`mt-4 font-display font-semibold leading-tight tracking-[-0.025em] ${
        inline ? "text-[1.45em] md:text-[1.8em]" : "text-[1.6em] md:text-[2.1em]"
      }`}
    >
      {data.place}
    </h3>

    <div
      className={`mt-6 grid gap-3 sm:grid-cols-2 ${inline ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}
    >
      {data.metrics.map((m) => (
        <div key={m.label} className="rounded-2xl bg-cream/[0.06] p-4">
          <div className="font-display text-[1.4em] font-semibold leading-none text-brand">
            {m.value}
          </div>
          <div className="mt-2 text-[0.88em] leading-snug text-cream">{m.label}</div>
          {m.note && (
            <div className="mt-1 text-[0.8em] leading-snug text-cream-muted">{m.note}</div>
          )}
        </div>
      ))}
    </div>

    <div className={`mt-7 grid gap-6 ${inline ? "" : "md:grid-cols-2 md:gap-8"}`}>
      <div>
        <h4 className="flex items-center gap-2 font-display text-[1.05em] font-semibold">
          <Icon name="TriangleAlert" size={17} className="text-brand" />
          что было
        </h4>
        <p className="mt-3 leading-relaxed text-cream-muted">{data.problem}</p>
      </div>
      <div>
        <h4 className="flex items-center gap-2 font-display text-[1.05em] font-semibold">
          <Icon name="Wrench" size={17} className="text-brand" />
          что сделали
        </h4>
        <ul className="mt-3 space-y-2.5">
          {data.actions.map((a) => (
            <li key={a} className="flex gap-2.5 leading-snug text-cream-muted">
              <Icon name="Check" size={16} className="mt-1 shrink-0 text-brand" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <p className="mt-7 rounded-2xl bg-brand/12 p-4 md:p-5 leading-relaxed text-cream">{data.result}</p>

    {checklist && (
      <Link
        to={`/chek-listy/${checklist.slug}`}
        className="group mt-4 flex flex-col gap-3 md:gap-4 rounded-2xl border border-cream/20 p-4 md:p-5 transition-colors hover:border-brand hover:bg-brand/10 sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="flex min-w-0 gap-3">
          <Icon name={checklist.icon} size={20} className="mt-0.5 shrink-0 text-brand" />
          <span className="min-w-0">
            <span className="block text-[0.82em] uppercase tracking-wide text-cream-muted">
              сделайте то же самое у себя
            </span>
            <span className="mt-1 block font-display text-[1.05em] font-semibold text-cream">
              Чек-лист «{checklist.navLabel}»
            </span>
            <span className="mt-1 block text-[0.88em] leading-snug text-cream-muted">
              {countItems(checklist)} пунктов · отметки сохраняются
            </span>
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 text-[0.9em] font-medium text-brand">
          открыть
          <Icon name="ArrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    )}
  </div>
  );
};

export default CityCaseBlock;
