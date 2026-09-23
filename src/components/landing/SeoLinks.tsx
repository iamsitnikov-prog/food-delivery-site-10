import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";
import { CITY_PAGES, SERVICE_PAGES } from "@/data/seo-pages";

const SeoLinks = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="px-5 py-20 md:px-14 md:py-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[64px]">
          подробно
          <span className="block pl-[1.2em] text-muted-foreground">о&nbsp;работе</span>
        </h2>
        <p className="max-w-[360px] text-[1.05em] leading-snug">
          Разобрали каждую услугу и&nbsp;специфику городов на&nbsp;отдельных страницах.
        </p>
      </div>

      <div className="reveal grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] bg-pale p-7 md:p-8">
          <h3 className="font-display text-[1.5em] font-semibold tracking-[-0.025em]">услуги</h3>
          <ul className="mt-5 space-y-2">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/uslugi/${s.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-foreground/15 py-3 text-[0.98em]"
                >
                  {s.navLabel}
                  <Icon
                    name="ArrowUpRight"
                    size={18}
                    className="shrink-0 text-foreground/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] bg-surface p-7 text-cream md:p-8">
          <h3 className="font-display text-[1.5em] font-semibold tracking-[-0.025em]">города</h3>
          <ul className="mt-5 space-y-2">
            {CITY_PAGES.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/goroda/${c.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-cream/20 py-3 text-[0.98em]"
                >
                  {c.navLabel}
                  <Icon
                    name="ArrowUpRight"
                    size={18}
                    className="shrink-0 text-cream-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9em] leading-snug text-cream-muted">
            Вашего города нет в&nbsp;списке? Работаем по&nbsp;всей России — обучение и&nbsp;поддержка онлайн.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeoLinks;
