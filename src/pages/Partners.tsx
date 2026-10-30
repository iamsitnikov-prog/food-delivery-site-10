import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PartnerLogo from "@/components/PartnerLogo";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import type React from "react";
import { useState } from "react";
import { PARTNERS, PARTNER_SECTIONS, USEFUL_SITES, ALL_RUSSIA, PARTNER_CITIES } from "@/data/partners";

// Кнопки разделов сверху: все разделы по порядку и полезные сайты.
const NAV = [
  ...PARTNER_SECTIONS.map((s) => ({ id: s.id, title: s.title, icon: s.icon, count: PARTNERS.filter((p) => p.section === s.id).length })),
  { id: "poleznye-sajty", title: "Полезные сайты", icon: "BookOpen", count: 0 },
];
const CITIES = Array.from(
  new Set([
    ...PARTNER_CITIES,
    ...PARTNERS.flatMap((p) => p.cities).filter((c) => c !== ALL_RUSSIA),
  ]),
);

const PartnersPage = () => {
  const { pathname } = useLocation();
  const [city, setCity] = useState("");
  const [active, setActive] = useState("");
  const inCity = (cities: string[]) => !city || cities.includes(ALL_RUSSIA) || cities.includes(city);
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  useSeo({
    title: "Партнёры и полезные сайты для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Сервисы, которые мы рекомендуем ресторанам: своя доставка, аналитика прибыли, продвижение на картах. И полезные официальные сайты для партнёров Яндекс Еды.",
    path: pathname,
  });

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-10 pt-8 md:px-14 md:pb-20 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-6 md:mb-8 flex items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">партнёры</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            Партнёры и полезные сайты
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.1em] leading-snug text-muted-foreground">
            Мы&nbsp;не&nbsp;занимаемся всем сразу. Там, где нужен отдельный инструмент, советуем тех, кем пользуемся сами в&nbsp;работе с&nbsp;проектами.
          </p>
        </section>
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <label className="flex w-fit items-center gap-2 text-[max(12px,0.88em)] text-foreground/70">
          <Icon name="MapPin" size={16} />
          город
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-transparent bg-pale px-3 py-2 font-medium text-foreground outline-none focus:border-foreground/50"
          >
            <option value="">все города</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {/* Навигация по разделам: одна строка, закреплена сверху, по клику плавно прокручивает к разделу */}
        <div className="sticky top-0 z-20 -mx-5 mt-4 bg-background/95 py-3 backdrop-blur md:-mx-14">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 md:px-14" aria-label="Разделы" style={{ scrollbarWidth: "thin" }}>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => go(e, n.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2 text-[max(12px,0.88em)] font-medium transition-colors ${
                  active === n.id ? "border-foreground bg-foreground text-background" : "border-transparent bg-pale text-foreground/80 hover:border-foreground/30"
                }`}
              >
                <Icon name={n.icon} size={15} />
                {n.title}
                {n.count > 0 && <span className="text-[0.85em] opacity-60">{n.count}</span>}
              </a>
            ))}
          </div>
        </div>

        {PARTNER_SECTIONS.map((section) => {
          const items = PARTNERS.filter((p) => p.section === section.id && inCity(p.cities));
          if (!items.length)
            return (
              <div key={section.id} id={section.id} className="scroll-mt-20 pt-6 md:pt-8">
                <div className="flex flex-col gap-3 rounded-[20px] border-2 border-dashed border-foreground/20 p-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                  <h2 className="flex items-center gap-2.5 font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.3em]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pale">
                      <Icon name={section.icon} size={18} />
                    </span>
                    {section.title}
                  </h2>
                  <Link
                    to={`/partneram?razdel=${section.id}`}
                    className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-pale px-4 py-2 text-[max(12px,0.9em)] font-medium transition-colors hover:bg-foreground hover:text-background"
                  >
                    {section.id === "drugoe" ? "делаете что-то ещё? заполните анкету" : "ищем партнёра, заполните анкету"}
                    <Icon name="Plus" size={16} className="transition-transform group-hover:rotate-90" />
                  </Link>
                </div>
              </div>
            );
          return (
            <div key={section.id} id={section.id} className="scroll-mt-20 pt-8 md:pt-12">
              <h2 className="flex items-center gap-2.5 font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.6em]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-brand">
                  <Icon name={section.icon} size={18} />
                </span>
                {section.title}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/partnery/${p.slug}`}
                    className="group flex min-w-0 flex-col rounded-[20px] bg-pale p-4 transition-transform duration-300 hover:-translate-y-1 md:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <PartnerLogo p={p} className="h-11 w-11 shrink-0 rounded-xl p-1.5 text-[1.3em]" />
                      <div className="min-w-0">
                        <div className="truncate font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">{p.name}</div>
                        <div className="mt-0.5 inline-flex items-center gap-1 text-[max(12px,0.8em)] text-foreground/55">
                          <Icon name="MapPin" size={12} />
                          {p.cities.includes(ALL_RUSSIA) ? "вся Россия" : p.cities.join(", ")}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 flex-1 leading-snug text-foreground/75">{p.tagline}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      {p.promo ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1 text-[max(12px,0.78em)] font-medium text-brand">
                          <Icon name="Gift" size={14} className="shrink-0" />
                          <span className="truncate">{p.promo.code ? "есть промокод" : "спецпредложение"}</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="inline-flex shrink-0 items-center gap-1.5 font-medium">
                        подробнее
                        <Icon name="ArrowRight" size={17} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/partneram?razdel=${section.id}`}
                  className="group flex flex-col justify-between rounded-[20px] border-2 border-dashed border-foreground/20 p-4 transition-colors hover:border-foreground/50 md:p-5"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium leading-tight">
                      Место свободно
                    </span>
                    <Icon name="Plus" size={18} className="shrink-0 transition-transform group-hover:rotate-90" />
                  </span>
                  <span className="mt-3 text-[max(12px,0.85em)] leading-snug text-foreground/60">
                    Заполните анкету, и&nbsp;мы расскажем о&nbsp;вас ресторанам. Займёт 5&nbsp;минут.
                  </span>
                </Link>
              </div>
            </div>
          );
        })}

        <div id="poleznye-sajty" className="scroll-mt-20 pt-12 md:pt-16">
          <h2 className="flex items-center gap-2.5 font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.6em]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-brand">
              <Icon name="BookOpen" size={18} />
            </span>
            Полезные сайты
          </h2>
          <p className="mt-2 max-w-[620px] text-muted-foreground">
            Официальные ресурсы, которые стоит держать в&nbsp;закладках каждому, кто работает с&nbsp;Яндекс Едой.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {USEFUL_SITES.map((u) => (
              <a
                key={u.url}
                href={u.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 flex-col rounded-[20px] bg-pale p-4 transition-transform duration-300 hover:-translate-y-1 md:p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream">
                    <Icon name={u.icon} size={20} />
                  </span>
                  <Icon name="ArrowUpRight" size={18} className="shrink-0 text-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-3 font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">{u.name}</span>
                <span className="mt-2 block leading-snug text-foreground/70">{u.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-16" />
        <div className="mt-4 flex flex-col justify-between gap-6 rounded-[24px] md:rounded-[32px] bg-pale p-4 md:flex-row md:items-center md:p-11">
          <div>
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
              Хотите стать партнёром?
            </h2>
            <p className="mt-3 max-w-[560px] leading-relaxed text-foreground/75">
              Если ваш сервис полезен ресторанам, заполните анкету: займёт 5&nbsp;минут, и&nbsp;мы добавим вас в&nbsp;нужный раздел.
            </p>
          </div>
          <Link
            to="/partneram"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            заполнить анкету
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </section>

      <CrossLinks
        items={["audit", "reports", "calc"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PartnersPage;