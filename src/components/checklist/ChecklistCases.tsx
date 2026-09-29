import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { CITY_CASES } from "@/data/city-cases";
import { CITY_PAGES } from "@/data/seo-cities";

const ChecklistCases = ({ slug }: { slug: string }) => {
  const cases = Object.entries(CITY_CASES)
    .filter(([, c]) => c.checklist === slug)
    .slice(0, 3)
    .map(([citySlug, c]) => ({
      citySlug,
      data: c,
      city: CITY_PAGES.find((p) => p.slug === citySlug)?.navLabel ?? citySlug,
    }));

  if (cases.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        это работает
        <span className="pl-3 text-muted-foreground">на практике</span>
      </h2>
      <p className="mt-4 max-w-[620px] leading-relaxed text-muted-foreground">
        Заведения, которые прошли по этим пунктам вместе с нами. Цифры — из их отчётов за период
        работы.
      </p>

      <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cases.map(({ citySlug, data, city }) => (
          <Link
            key={citySlug}
            to={`/goroda/${citySlug}#case`}
            className="group flex flex-col rounded-[24px] bg-surface p-4 md:p-6 text-cream transition-transform hover:-translate-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 text-[0.82em] text-cream-muted">
              <Icon name="MapPin" size={15} className="text-brand" />
              {city} · {data.period}
            </div>
            <h3 className="mt-3 font-display text-[1.2em] font-semibold leading-tight">
              {data.place}
            </h3>

            <div className="mt-4 space-y-2">
              {data.metrics.slice(0, 2).map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.86em] leading-snug text-cream-muted">{m.label}</span>
                  <span className="shrink-0 font-display text-[1.05em] font-semibold tabular-nums text-brand">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <span className="mt-5 inline-flex items-center gap-2 text-[0.88em] font-medium text-brand">
              читать кейс
              <Icon
                name="ArrowRight"
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ChecklistCases;
