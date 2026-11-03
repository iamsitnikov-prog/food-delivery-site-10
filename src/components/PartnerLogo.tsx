import type { Partner } from "@/data/partners";

/** Единая квадратная рамка для логотипов и фотографий партнёров. */
const PartnerLogo = ({ p, className = "" }: { p: Pick<Partner, "name" | "logo">; className?: string }) => {
  // Фото и знак на сплошном фоне заполняют рамку; прозрачные логотипы сохраняем целиком.
  const fill = p.logo?.includes("lutcenkova-evgenia-") || p.logo === "/partners/magnit-restorany-logo.png";

  return p.logo ? (
    <img
      src={p.logo}
      alt={`Логотип ${p.name}`}
      width={96}
      height={96}
      loading="lazy"
      decoding="async"
      className={`${className} bg-cream ${fill ? "object-cover" : "object-contain"}`}
    />
  ) : (
    <span aria-hidden="true" className={`${className} flex items-center justify-center bg-foreground font-display font-semibold text-brand`}>
      {p.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 1).toUpperCase()}
    </span>
  );
};

export default PartnerLogo;
