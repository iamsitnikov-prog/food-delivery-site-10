import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PartnerLogo from "@/components/PartnerLogo";
import { useReveal } from "@/hooks/use-reveal";
import { PARTNERS, getSection } from "@/data/partners";

const Partners = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="partners" ref={ref} className="hidden scroll-mt-4 px-5 pb-10 md:block md:px-14 md:pb-28">
      <div className="reveal mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="font-display text-[23px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[60px]">
          с кем работаем
        </h2>
        <p className="max-w-[420px] text-[1.02em] leading-snug text-muted-foreground">
          Сервисы, которые мы советуем клиентам и&nbsp;используем сами в&nbsp;работе с&nbsp;проектами.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.slice(0, 5).map((p) => (
          <Link
            key={p.slug}
            to={`/partnery/${p.slug}`}
            className="reveal group relative flex flex-col overflow-hidden rounded-[24px] border border-foreground/10 bg-white p-5 pt-6 transition-transform duration-500 hover:-translate-y-1 md:p-7 md:pt-8"
          >
            <div className="flex items-center gap-3">
              <PartnerLogo p={p} className="h-12 w-12 shrink-0 rounded-xl p-1.5 text-[1.4em]" />
              <div className="min-w-0">
                <span className="block font-display text-[1.4em] font-semibold leading-tight tracking-[-0.03em]">{p.name}</span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 text-[max(12px,0.8em)] text-foreground/60">
                  <Icon name={getSection(p.section).icon} size={14} />
                  {getSection(p.section).title}
                </span>
              </div>
            </div>
            <p className="mt-4 flex-1 leading-snug text-foreground/75">{p.tagline}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium">
              подробнее
              <Icon name="ArrowRight" size={18} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}

        <div className="reveal flex flex-col justify-between rounded-[28px] bg-pale p-4 md:p-8">
          <div>
            <h3 className="font-display text-[1.5em] font-semibold leading-tight tracking-[-0.025em] md:text-[1.9em]">
              Все партнёры и&nbsp;полезные сайты
            </h3>
            <p className="mt-4 leading-relaxed text-foreground/75">
              {PARTNERS.length} сервисов по&nbsp;разделам: доставка, автоматизация, курьеры, маркетинг и&nbsp;другие. С&nbsp;фильтром по&nbsp;городам.
            </p>
          </div>
          <Link
            to="/partnery"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            смотреть партнёров
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Partners;