import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { VISIBLE_CALC_PAGES } from "@/data/calculators";

const ALL = {
  slug: "",
  icon: "LayoutGrid",
  navLabel: "Все калькуляторы",
  accent: false,
};

const CalcSwitcher = ({ active }: { active?: string }) => {
  const items = [
    ALL,
    ...VISIBLE_CALC_PAGES.map((p) => ({
      slug: p.slug,
      icon: p.icon,
      navLabel: p.navLabel,
      accent: !!p.accent,
    })),
  ];

  return (
    <nav aria-label="Калькуляторы" className="flex flex-wrap gap-2.5">
      {items.map((p) => {
        const isActive = (active || "") === p.slug;
        return (
          <Link
            key={p.slug || "all"}
            to={p.slug ? `/kalkulyatory/${p.slug}` : "/kalkulyatory"}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[0.88em] font-medium transition-colors ${
              isActive
                ? "border-foreground bg-foreground text-brand"
                : p.accent
                  ? "border-transparent bg-[#C7161B] text-white hover:bg-[#A51216]"
                  : "border-foreground/20 hover:bg-foreground hover:text-brand"
            }`}
          >
            <Icon name={p.icon} size={16} />
            {p.navLabel}
          </Link>
        );
      })}
    </nav>
  );
};

export default CalcSwitcher;
