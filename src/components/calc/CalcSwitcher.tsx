import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { VISIBLE_CALC_PAGES } from "@/data/calculators";

const ALL = {
  slug: "",
  icon: "LayoutGrid",
  navLabel: "Все калькуляторы",
  accent: false,
};

const CalcSwitcher = ({
  active,
  onSelect,
}: {
  active?: string;
  onSelect?: (slug: string) => void;
}) => {
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
    <nav
      aria-label="Калькуляторы"
      className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {items.map((p) => {
        const isActive = (active || "") === p.slug;
        const cls = `inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-[0.88em] font-medium transition-colors ${
          isActive
            ? "border-foreground bg-foreground text-brand"
            : p.accent
              ? "border-transparent bg-[#C7161B] text-white hover:bg-[#A51216]"
              : "border-foreground/20 hover:bg-foreground hover:text-brand"
        }`;

        if (onSelect) {
          return (
            <button
              key={p.slug || "all"}
              type="button"
              onClick={() => onSelect(p.slug)}
              aria-current={isActive ? "page" : undefined}
              className={cls}
            >
              <Icon name={p.icon} size={16} />
              {p.navLabel}
            </button>
          );
        }

        return (
          <Link
            key={p.slug || "all"}
            to={p.slug ? `/kalkulyatory/${p.slug}` : "/kalkulyatory"}
            aria-current={isActive ? "page" : undefined}
            className={cls}
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
