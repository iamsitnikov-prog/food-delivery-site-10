import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { VISIBLE_CALC_PAGES, COMPARE_PAGES } from "@/data/calculators";

type Item = {
  slug: string;
  icon: string;
  navLabel: string;
  accent: boolean;
  path: string;
  external?: boolean;
};

const ALL: Item = {
  slug: "",
  icon: "TrendingUp",
  navLabel: "Окупаемость канала",
  accent: false,
  path: "/kalkulyatory",
};

const CalcSwitcher = ({
  active,
  onSelect,
}: {
  active?: string;
  onSelect?: (slug: string) => void;
}) => {
  const items: Item[] = [
    ALL,
    ...VISIBLE_CALC_PAGES.map((p) => ({
      slug: p.slug,
      icon: p.icon,
      navLabel: p.navLabel,
      accent: !!p.accent,
      path: `/kalkulyatory/${p.slug}`,
    })),
    ...COMPARE_PAGES.map((p) => ({
      slug: p.path,
      icon: p.icon,
      navLabel: p.navLabel,
      accent: !!p.accent,
      path: p.path,
      external: !p.path.startsWith("/kalkulyatory"),
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

        if (onSelect && !p.external) {
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
            to={p.path}
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
