import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useReveal } from "@/hooks/use-reveal";
import { CALC_PAGES } from "@/data/calculators";

const CalcTeaser = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="min-w-0">
            <h2 className="font-display text-[38px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[56px]">
              калькуляторы
            </h2>
            <p className="mt-4 max-w-[540px] leading-snug text-muted-foreground">
              Введите свои цифры и&nbsp;сразу увидите, сколько остаётся с&nbsp;заказа, окупается&nbsp;ли продвижение и&nbsp;когда выручка выведет за&nbsp;порог по&nbsp;НДС.
            </p>
          </div>
          <Link
            to="/kalkulyatory"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:self-auto"
          >
            все калькуляторы
            <Icon name="ArrowRight" size={17} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CALC_PAGES.map((p) => (
            <Link
              key={p.slug}
              to={`/kalkulyatory/${p.slug}`}
              className="group rounded-[24px] bg-surface p-6 text-cream transition-transform hover:-translate-y-1"
            >
              <Icon name={p.icon} size={24} className="text-brand" />
              <h3 className="mt-4 font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">
                {p.navLabel}
              </h3>
              <p className="mt-2.5 text-[0.92em] leading-snug text-cream-muted">{p.lead}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalcTeaser;
