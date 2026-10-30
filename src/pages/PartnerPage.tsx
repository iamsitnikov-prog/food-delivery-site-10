import { Link, useParams, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { PARTNERS, getPartner, getSection, partnerGoUrl, ALL_RUSSIA } from "@/data/partners";
import NotFound from "./PageNotFound";

const PartnerPage = () => {
  const { slug = "" } = useParams();
  const { pathname } = useLocation();
  const p = getPartner(slug);

  useSeo({
    title: p ? `${p.name}: ${p.tagline.toLowerCase()} | agregatory.pro` : "Партнёр не найден | agregatory.pro",
    description: p ? `${p.description.slice(0, 150)}` : "",
    path: pathname,
    noindex: !p,
  });

  if (!p) return <NotFound />;

  const sec = getSection(p.section);
  // Сначала партнёры из того же раздела, потом остальные.
  const others = [
    ...PARTNERS.filter((x) => x.slug !== p.slug && x.section === p.section),
    ...PARTNERS.filter((x) => x.section !== p.section),
  ].slice(0, 6);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <section className="px-5 pb-8 pt-8 md:px-14 md:pb-14 md:pt-16">
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

        <div className="flex items-center gap-4">
          <img
            src={p.logo}
            alt={`Логотип ${p.name}`}
            width={96}
            height={96}
            className="h-16 w-16 shrink-0 rounded-2xl border border-foreground/10 bg-white object-contain p-2 md:h-20 md:w-20"
          />
          <div className="flex flex-col items-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[max(12px,0.85em)] font-medium text-white" style={{ background: sec.color }}>
              <Icon name={sec.icon} size={15} />
              {sec.title}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[max(12px,0.85em)] text-foreground/65">
              <Icon name="MapPin" size={14} />
              {p.cities.includes(ALL_RUSSIA) ? "работает по всей России" : p.cities.join(", ")}
            </span>
          </div>
        </div>
        <h1 className="mt-6 font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[64px]">{p.name}</h1>
        <p className="mt-4 max-w-[680px] text-[1.15em] leading-snug md:text-[1.35em]">{p.tagline}</p>
      </section>

      <section className="grid gap-4 px-5 pb-11 md:grid-cols-[1.4fr_1fr] md:px-14 md:pb-20">
        <div className="relative overflow-hidden rounded-[24px] border border-foreground/10 bg-white p-5 md:rounded-[32px] md:p-10">
          <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: sec.color }} />
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">Что это за сервис</h2>
          <p className="mt-3 leading-relaxed text-foreground/75">{p.description}</p>

          <h2 className="mt-8 font-display text-[1.4em] font-semibold tracking-[-0.02em]">Что входит</h2>
          <ul className="mt-4 space-y-3">
            {p.points.map((point) => (
              <li key={point} className="flex gap-3 leading-snug text-foreground/80">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0" style={{ color: sec.color }} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-foreground/10 bg-white p-5 md:rounded-[32px] md:p-8">
            <div className="flex items-center gap-2 font-display text-[1.2em] font-semibold">
              <Icon name="Users" size={20} />
              Кому подойдёт
            </div>
            <p className="mt-3 leading-relaxed text-foreground/75">{p.forWhom}</p>
          </div>

          {p.promo && (
            <div className="rounded-[24px] border-2 border-dashed border-foreground/30 bg-white/70 p-5 md:rounded-[32px] md:p-8">
              <div className="flex items-center gap-2 text-[max(12px,0.8em)] uppercase tracking-wide text-muted-foreground">
                <Icon name="Gift" size={16} />
                {p.promo.code ? "промокод" : "спецпредложение"}
              </div>
              <div className="mt-2 break-words font-display text-[1.5em] font-semibold leading-tight tracking-[-0.01em]">{p.promo.code || p.promo.title}</div>
              <p className="mt-2 text-[max(12px,0.9em)] leading-snug text-muted-foreground">{p.promo.text}</p>
            </div>
          )}

          <a
            href={partnerGoUrl(p.slug)}
            target="_blank"
            rel="sponsored noopener"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-[1.05em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            перейти на сайт {p.name}
            <Icon name="ArrowUpRight" size={19} />
          </a>
        </div>
      </section>

      {others.length > 0 && (
        <section className="px-5 pb-11 md:px-14 md:pb-20">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em] md:text-[1.8em]">Другие партнёры</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/partnery/${o.slug}`}
                className="group flex min-w-0 items-center gap-3 rounded-[20px] border border-foreground/10 bg-white p-4 transition-transform hover:-translate-y-0.5"
              >
                <img src={o.logo} alt="" width={96} height={96} loading="lazy" className="h-11 w-11 shrink-0 rounded-xl border border-foreground/10 bg-white object-contain p-1.5" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{o.name}</span>
                  <span className="block truncate text-[max(12px,0.85em)] text-foreground/60">{o.tagline}</span>
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

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PartnerPage;
