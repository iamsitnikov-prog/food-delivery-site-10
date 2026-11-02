import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PartnerLogo from "@/components/PartnerLogo";
import { PARTNERS, SECTION_SERVICES, getSection, partnerGoUrl, ALL_RUSSIA, type Partner } from "@/data/partners";

/** Ссылка Telegram из ника, телефона или ссылки. */
export const tgHref = (v: string) => {
  const s = v.trim();
  if (/^https?:\/\//.test(s)) return s;
  if (/^\+?\d[\d\s()-]{6,}$/.test(s)) return `https://t.me/+${s.replace(/\D/g, "")}`;
  return `https://t.me/${s.replace(/^@/, "").replace(/^t\.me\//, "")}`;
};

const ctaLabel = (url: string, name: string) =>
  /^https?:\/\/(t\.me|telegram\.me)\//.test(url)
    ? "написать в Telegram"
    : /^https?:\/\/(www\.)?(vk\.com|instagram\.com|behance\.net)\//.test(url)
      ? "смотреть работы"
      : `перейти на сайт ${name}`;

type Props = {
  p: Partner;
  /** Чистая визитка: без других партнёров и ссылок в каталог. */
  clean?: boolean;
  /** Предпросмотр в анкете: ссылки не ведут наружу. */
  preview?: boolean;
};

/** Содержимое страницы партнёра. Используется на сайте и в предпросмотре анкеты. */
const PartnerProfile = ({ p, clean = false, preview = false }: Props) => {
  const sec = getSection(p.section);
  const [open, setOpen] = useState<number | null>(null);
  const works = p.works || [];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % works.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + works.length) % works.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, works.length]);

  // Конкурентов из того же раздела не показываем: только тех, кто дополняет услугу.
  const others = clean ? [] : PARTNERS.filter((x) => x.slug !== p.slug && x.section !== p.section).slice(0, 6);
  const href = p.url ? (preview ? undefined : partnerGoUrl(p.slug)) : p.telegram ? tgHref(p.telegram) : undefined;
  const label = p.url ? ctaLabel(p.url, p.name) : "написать в Telegram";

  const mainList = SECTION_SERVICES[p.section]?.main || [];
  const svc = p.services || [];
  const mainSvc = svc.filter((s) => mainList.includes(s));
  const otherSvc = svc.filter((s) => !mainList.includes(s));
  const servicesBlock = svc.length > 0;
  const groups = [
    { title: "для доставки и агрегаторов", list: mainSvc, accent: true },
    { title: mainSvc.length ? "другие услуги" : "услуги", list: otherSvc, accent: false },
  ].filter((g) => g.list.length);
  const servicesCard = servicesBlock ? (
    <div className="rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-8">
      <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">Услуги</h2>
      <div className={`mt-5 grid gap-6 ${groups.length > 1 && works.length ? "md:grid-cols-2" : ""}`}>
        {groups.map((g) => (
          <div key={g.title}>
            {groups.length > 1 && (
              <div className="mb-3 text-[max(12px,0.8em)] font-medium uppercase tracking-wide text-foreground/55">{g.title}</div>
            )}
            <ul className="space-y-2.5">
              {g.list.map((s) => (
                <li key={s} className="flex gap-3 leading-snug">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${g.accent ? "bg-foreground text-brand" : "border border-foreground/30"}`}>
                    <Icon name="Check" size={13} />
                  </span>
                  <span className={g.accent ? "font-medium" : "text-foreground/80"}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  ) : null;
  const cta =
    p.url || p.telegram ? (
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        onClick={preview ? (e) => e.preventDefault() : undefined}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-center text-[1.02em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        {label}
        <Icon name="ArrowUpRight" size={19} />
      </a>
    ) : null;
  const person = !p.url;

  return (
    <>
      <section className="px-5 pb-8 pt-8 md:px-14 md:pb-14 md:pt-16">
        {!clean && (
          <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground md:mb-8">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/partnery" className="hover:text-foreground">
              партнёры
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{p.name}</span>
          </nav>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <PartnerLogo p={p} className="h-16 w-16 shrink-0 rounded-2xl p-2 text-[2em] md:h-20 md:w-20" />
              <div className="flex flex-col items-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-[max(12px,0.85em)] font-medium text-background">
                  <Icon name={sec.icon} size={15} />
                  {sec.title}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[max(12px,0.85em)] text-foreground/65">
                  <Icon name="MapPin" size={14} />
                  {p.cities.includes(ALL_RUSSIA) ? "работает по всей России" : p.cities.join(", ")}
                </span>
              </div>
            </div>
            <h1 className="mt-6 break-words font-display text-[30px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[64px]">{p.name}</h1>
            {p.tagline && <p className="mt-4 max-w-[620px] text-[1.15em] leading-snug md:text-[1.35em]">{p.tagline}</p>}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {cta}
              {p.promo && (
                <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-foreground/30 px-4 py-3 text-[max(12px,0.9em)] font-medium">
                  <Icon name="Gift" size={17} />
                  {p.promo.code ? `промокод ${p.promo.code}` : p.promo.title}
                </span>
              )}
            </div>
          </div>
          {works.length > 0 ? (
            <button type="button" onClick={() => setOpen(0)} className="group relative hidden aspect-[4/3] overflow-hidden rounded-[32px] bg-pale lg:block" aria-label="Открыть работу 1">
              <img src={works[0]} alt={`${p.name}: работа 1`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </button>
          ) : (
            servicesCard
          )}
        </div>
      </section>

      {works.length > 0 && servicesBlock && <section className="px-5 pb-8 md:px-14 md:pb-14">{servicesCard}</section>}

      {works.length > 0 && (
        <section className="px-5 pb-8 md:px-14 md:pb-14">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em] md:text-[1.8em]">Работы</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
            {works.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                className="group relative aspect-square overflow-hidden rounded-[16px] bg-pale md:rounded-[20px]"
                aria-label={`Открыть работу ${i + 1}`}
              >
                <img src={src} alt={`${p.name}: работа ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 px-5 pb-11 md:grid-cols-[1.4fr_1fr] md:items-start md:px-14 md:pb-20">
        <div className="relative overflow-hidden rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-10">
          {p.description && (
            <>
              <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">{person ? "Обо мне" : "О компании"}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/75">{p.description}</p>
            </>
          )}
          {p.points.length > 0 && (
            <>
              <h2 className={`${p.description ? "mt-8" : ""} font-display text-[1.4em] font-semibold tracking-[-0.02em]`}>{person ? "Как работаю" : "Что входит"}</h2>
              <ul className="mt-4 space-y-3">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-snug text-foreground/80">
                    <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {p.prices && (
            <div className="rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-8">
              <div className="flex items-center gap-2 font-display text-[1.2em] font-semibold">
                <Icon name="Wallet" size={20} />
                Цены
              </div>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/75">{p.prices}</p>
            </div>
          )}
          {p.forWhom && (
            <div className="rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-8">
              <div className="flex items-center gap-2 font-display text-[1.2em] font-semibold">
                <Icon name="Users" size={20} />
                Кому подойдёт
              </div>
              <p className="mt-3 leading-relaxed text-foreground/75">{p.forWhom}</p>
            </div>
          )}
          {p.promo && (
            <div className="rounded-[24px] border-2 border-dashed border-foreground/30 bg-pale p-5 md:rounded-[32px] md:p-8">
              <div className="flex items-center gap-2 text-[max(12px,0.8em)] uppercase tracking-wide text-muted-foreground">
                <Icon name="Gift" size={16} />
                {p.promo.code ? "промокод" : "спецпредложение"}
              </div>
              <div className="mt-2 break-words font-display text-[1.5em] font-semibold leading-tight tracking-[-0.01em]">{p.promo.code || p.promo.title}</div>
              <p className="mt-2 text-[max(12px,0.9em)] leading-snug text-muted-foreground">{p.promo.text}</p>
            </div>
          )}
          {cta}
        </div>
      </section>

      {others.length > 0 && (
        <section className="px-5 pb-11 md:px-14 md:pb-20">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em] md:text-[1.8em]">Другие партнёры</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={`/partnery/${o.slug}`} className="group flex min-w-0 items-center gap-3 rounded-[20px] bg-pale p-4 transition-transform hover:-translate-y-0.5">
                <PartnerLogo p={o} className="h-11 w-11 shrink-0 rounded-xl p-1.5 text-[1.3em]" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{o.name}</span>
                  <span className="block text-[max(12px,0.85em)] leading-snug text-foreground/60">{o.tagline}</span>
                </span>
                <Icon name="ArrowRight" size={17} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
          <Link to="/partnery" className="mt-5 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            все партнёры и полезные сайты
            <Icon name="ArrowRight" size={17} />
          </Link>
        </section>
      )}

      {open !== null && works[open] && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-4" onClick={() => setOpen(null)}>
          <img src={works[open]} alt={`${p.name}: работа ${open + 1}`} className="max-h-[88vh] max-w-full rounded-[16px] object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" aria-label="Закрыть" onClick={() => setOpen(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-background text-foreground">
            <Icon name="X" size={20} />
          </button>
          {works.length > 1 && (
            <>
              <button type="button" aria-label="Предыдущая" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + works.length) % works.length); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-background text-foreground">
                <Icon name="ChevronLeft" size={22} />
              </button>
              <button type="button" aria-label="Следующая" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % works.length); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-background text-foreground">
                <Icon name="ChevronRight" size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PartnerProfile;
