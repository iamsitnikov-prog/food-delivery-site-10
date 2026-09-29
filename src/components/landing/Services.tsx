import { HOME_SERVICES as SERVICES } from "@/data/home";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";


const Services = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="services" ref={ref} className="scroll-mt-4 px-5 py-10 md:px-14 md:py-28">
      <div className="reveal mb-6 flex flex-col md:mb-12 justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          наши
          <span className="block pl-[1.2em] text-muted-foreground">услуги</span>
        </h2>
        <p className="max-w-[360px] text-[1.05em] leading-snug">
          Обеспечиваем полный цикл запуска и&nbsp;продвижения вашего ресторана в&nbsp;доставке: от&nbsp;регистрации до&nbsp;лояльности гостей.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((item, i) => {
          const light = i % 2 === 1;
          return (
            <article
              key={item.title}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={`reveal group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-8 ${
                light ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl md:h-12 md:w-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                    light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                  }`}
                >
                  <Icon name={item.icon} size={20} className="md:size-6" />
                </span>
                <span
                  className={`font-display text-[1.1em] font-semibold ${light ? "text-foreground/70" : "text-cream-muted"}`}
                >
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[1.28em] font-semibold leading-[1.05] tracking-[-0.025em] md:mt-7 md:text-[1.5em]">
                {item.title}
              </h3>
              <p className={`mt-2 text-[0.92em] ${light ? "text-foreground/70" : "text-brand"}`}>{item.short}</p>
              <p
                className={`mt-4 text-[0.95em] leading-relaxed ${light ? "text-foreground/80" : "text-cream-muted"}`}
              >
                {item.text}
              </p>

              <ul
                className={`mt-5 flex-1 space-y-2.5 border-t pt-4 text-[max(12px,0.9em)] leading-snug md:mt-7 md:space-y-3 md:pt-6 md:text-[0.93em] ${
                  light ? "border-foreground/20" : "border-cream/20"
                }`}
              >
                {item.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Icon
                      name="Check"
                      size={18}
                      className={`mt-0.5 shrink-0 ${light ? "text-foreground" : "text-brand"}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="reveal mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a
          href="#lead"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          обсудить задачу
        </a>
        <Link
          to="/uslugi"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-7 py-4 font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          все услуги <Icon name="ArrowRight" size={18} />
        </Link>
        <span className="text-[0.92em] text-muted-foreground">подберём услуги под ваш ресторан</span>
      </div>
    </section>
  );
};

export default Services;