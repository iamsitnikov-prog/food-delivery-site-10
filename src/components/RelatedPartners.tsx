import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PartnerLogo from "@/components/PartnerLogo";
import { PARTNERS } from "@/data/partners";

/** Блок «подрядчики по теме»: партнёры из подходящих разделов. Если таких нет, ничего не показываем. */
const RelatedPartners = ({ sections, className = "", narrow = false }: { sections: string[]; className?: string; narrow?: boolean }) => {
  const items = sections.flatMap((s) => PARTNERS.filter((p) => p.section === s)).slice(0, 3);
  if (!items.length) return null;
  const anchor = sections.find((s) => PARTNERS.some((p) => p.section === s)) || "";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <div className="text-[max(12px,0.8em)] uppercase tracking-wide text-muted-foreground">подрядчики по теме</div>
          <div className="mt-1 font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">Партнёры, которым мы доверяем</div>
        </div>
        <Link to={`/partnery#${anchor}`} className="inline-flex items-center gap-1.5 text-[max(12px,0.9em)] font-medium underline-offset-4 hover:underline">
          все партнёры
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
      <div className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 ${narrow ? "" : "lg:grid-cols-3"}`}>
        {items.map((p) => (
          <Link
            key={p.slug}
            to={`/partnery/${p.slug}`}
            className="group flex min-w-0 items-center gap-3 rounded-[20px] bg-pale p-4 transition-transform hover:-translate-y-0.5"
          >
            <PartnerLogo p={p} className="h-11 w-11 shrink-0 rounded-xl p-1.5 text-[1.3em]" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-tight">{p.name}</span>
              <span className="mt-0.5 block text-[max(12px,0.85em)] leading-snug text-foreground/60">{p.tagline}</span>
            </span>
            <Icon name="ArrowRight" size={17} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPartners;
