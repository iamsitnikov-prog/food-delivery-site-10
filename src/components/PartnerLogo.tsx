import type { Partner } from "@/data/partners";

/** Логотип партнёра. Если логотипа нет, рисуем знак с первой буквой названия в цветах сайта. */
const PartnerLogo = ({ p, className = "" }: { p: Pick<Partner, "name" | "logo">; className?: string }) =>
  p.logo ? (
    <img src={p.logo} alt={`Логотип ${p.name}`} width={96} height={96} loading="lazy" decoding="async" className={`${className} bg-cream object-contain`} />
  ) : (
    <span aria-hidden="true" className={`${className} flex items-center justify-center bg-foreground font-display font-semibold text-brand`}>
      {p.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 1).toUpperCase()}
    </span>
  );

export default PartnerLogo;
