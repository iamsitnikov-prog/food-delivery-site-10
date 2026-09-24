import Icon from "@/components/ui/icon";
import type { CityCase } from "@/data/city-cases";

const CityCaseBlock = ({ data, city }: { data: CityCase; city: string }) => (
  <div className="rounded-[28px] bg-surface p-6 text-cream md:p-10">
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="rounded-lg bg-brand px-3 py-1.5 text-[0.78em] font-bold uppercase tracking-wide text-foreground">
        кейс
      </span>
      <span className="text-[0.85em] text-cream-muted">
        {city} · {data.kind} · {data.period}
      </span>
    </div>

    <h2 className="mt-4 font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
      {data.place}
    </h2>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.metrics.map((m) => (
        <div key={m.label} className="rounded-2xl bg-cream/[0.06] p-4">
          <div className="font-display text-[1.45em] font-semibold leading-none text-brand">
            {m.value}
          </div>
          <div className="mt-2 text-[0.88em] leading-snug text-cream">{m.label}</div>
          {m.note && (
            <div className="mt-1 text-[0.8em] leading-snug text-cream-muted">{m.note}</div>
          )}
        </div>
      ))}
    </div>

    <div className="mt-7 grid gap-6 md:grid-cols-2 md:gap-8">
      <div>
        <h3 className="flex items-center gap-2 font-display text-[1.1em] font-semibold">
          <Icon name="TriangleAlert" size={17} className="text-brand" />
          что было
        </h3>
        <p className="mt-3 leading-relaxed text-cream-muted">{data.problem}</p>
      </div>
      <div>
        <h3 className="flex items-center gap-2 font-display text-[1.1em] font-semibold">
          <Icon name="Wrench" size={17} className="text-brand" />
          что сделали
        </h3>
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

    <p className="mt-7 rounded-2xl bg-brand/12 p-5 leading-relaxed text-cream">{data.result}</p>
  </div>
);

export default CityCaseBlock;
