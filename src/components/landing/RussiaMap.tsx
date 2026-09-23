import { Link } from "react-router-dom";
import { CITY_PAGES } from "@/data/seo-cities";

const POINTS: Record<string, { x: number; y: number; align?: "left" | "right" }> = {
  "sankt-peterburg": { x: 14, y: 27, align: "left" },
  cherepovets: { x: 18.5, y: 22 },
  moskva: { x: 15, y: 40, align: "left" },
  "nizhniy-novgorod": { x: 20.5, y: 33 },
  kazan: { x: 24, y: 42 },
  voronezh: { x: 14.5, y: 52, align: "left" },
  samara: { x: 23, y: 51 },
  "rostov-na-donu": { x: 11.5, y: 62, align: "left" },
  krasnodar: { x: 9.5, y: 71, align: "left" },
  sochi: { x: 12.5, y: 79, align: "left" },
  ufa: { x: 28.5, y: 47 },
  chelyabinsk: { x: 31, y: 40 },
  ekaterinburg: { x: 29, y: 31 },
  perm: { x: 26, y: 25 },
  tyumen: { x: 34, y: 27 },
  novosibirsk: { x: 42, y: 45 },
  krasnoyarsk: { x: 51, y: 36 },
};

const RussiaMap = () => {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="relative mx-auto aspect-[16/9] w-full max-w-[1000px]">
        <svg viewBox="0 0 100 56" className="h-full w-full" role="img" aria-label="Карта России с городами присутствия">
          <defs>
            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M4 0 L0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.12" className="text-cream/10" />
            </pattern>
          </defs>
          <rect width="100" height="56" fill="url(#grid)" />

          <path
            d="M9 16 L12 11 L16 13 L20 10 L24 13 L28 9 L31 13 L36 10 L40 7 L44 11 L50 10 L56 12 L62 9 L68 11 L74 9 L80 12 L86 10 L90 13 L95 12 L97 16 L93 18 L95 22 L93 28 L91 24 L89 21 L86 24 L83 28 L80 32 L78 36 L75 39 L72 37 L70 33 L65 34 L60 33 L55 35 L50 36 L45 38 L42 36 L38 37 L34 39 L30 40 L26 42 L22 44 L19 43 L17 46 L14 45 L12 42 L10 38 L8 33 L7 27 L8 20 Z"
            className="fill-cream/[0.07] stroke-cream/25"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />

          {Object.entries(POINTS).map(([slug, p]) => (
            <g key={slug}>
              <circle cx={p.x} cy={p.y * 0.56} r="1.6" className="fill-brand/20">
                <animate attributeName="r" values="1.2;2.6;1.2" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y * 0.56} r="0.7" className="fill-brand" />
            </g>
          ))}
        </svg>

        {CITY_PAGES.map((c) => {
          const p = POINTS[c.slug];
          if (!p) return null;
          return (
            <Link
              key={c.slug}
              to={`/goroda/${c.slug}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={`absolute hidden -translate-y-1/2 whitespace-nowrap text-[11px] leading-none text-cream-muted transition-colors hover:text-brand lg:block ${
                p.align === "left" ? "-translate-x-full pr-3" : "pl-3"
              }`}
            >
              {c.navLabel}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/20 pt-6">
        <span className="flex items-center gap-2 text-[0.9em]">
          <span className="h-2 w-2 rounded-full bg-brand" />
          {CITY_PAGES.length} городов с отдельным разбором
        </span>
        <span className="text-[0.9em] text-cream-muted">
          и вся остальная Россия — работаем онлайн, от&nbsp;Калининграда до&nbsp;Дальнего Востока
        </span>
      </div>
    </div>
  );
};

export default RussiaMap;