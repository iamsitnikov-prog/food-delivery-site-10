import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PartnerLogo from "@/components/PartnerLogo";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { useState } from "react";
import { PARTNERS, PARTNER_SECTIONS, USEFUL_SITES, ALL_RUSSIA, PARTNER_CITIES } from "@/data/partners";

const ALL = "все";
const SITES = "полезные сайты";
// Разделы показываем только непустые, в порядке PARTNER_SECTIONS.
const USED = PARTNER_SECTIONS.filter((s) => PARTNERS.some((p) => p.section === s.id));
const EMPTY = PARTNER_SECTIONS.filter((s) => !PARTNERS.some((p) => p.section === s.id));
const FILTERS = [ALL, ...USED.map((s) => s.id), SITES];
const CITIES = Array.from(
  new Set([
    ...PARTNER_CITIES,
    ...PARTNERS.flatMap((p) => p.cities).filter((c) => c !== ALL_RUSSIA),
  ]),
);

const PartnersPage = () => {
  const { pathname } = useLocation();
  const [filter, setFilter] = useState(ALL);
  const [city, setCity] = useState("");
  const inCity = (cities: string[]) => !city || cities.includes(ALL_RUSSIA) || cities.includes(city);
  const groups = USED.filter((s) => filter === ALL || filter === s.id)
    .map((section) => ({ section, items: PARTNERS.filter((p) => p.section === section.id && inCity(p.cities)) }))
    .filter((g) => g.items.length > 0);
  const cards = groups.flatMap(({ section, items }) => items.map((p) => ({ p, section })));
  const single = filter !== ALL && filter !== SITES ? USED.find((x) => x.id === filter) : undefined;
  const sites = filter === ALL || filter === SITES ? USEFUL_SITES : [];

  useSeo({
    title: "Партнёры и полезные сайты для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Сервисы, которые мы рекомендуем ресторанам: своя доставка, аналитика прибыли, продвижение на картах. И полезные официальные сайты для партнёров Яндекс Еды.",
    path: pathname,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
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
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0" aria-label="Разделы">
            {FILTERS.map((f) => {
              const sec = PARTNER_SECTIONS.find((x) => x.id === f);
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2 text-[max(12px,0.88em)] font-medium transition-colors ${
                    active ? "border-foreground bg-foreground text-background" : "border-transparent bg-pale text-foreground/80 hover:border-foreground/30"
                  }`}
                >
                  {sec && <Icon name={sec.icon} size={15} />}
                  {sec ? sec.title : f}
                </button>
              );
            })}
          </div>
          <label className="flex shrink-0 items-center gap-2 text-[max(12px,0.88em)] text-foreground/70">
            <Icon name="MapPin" size={16} />
            <span className="sr-only md:not-sr-only">город</span>
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
        </div>

        {groups.length === 0 && filter !== SITES && (
          <p className="mt-8 rounded-[20px] bg-pale p-5 text-foreground/75">
            В этом городе пока нет партнёров из этого раздела. Посмотрите все города или напишите нам: подскажем, к кому обратиться.
          </p>
        )}

        {single && (
          <h2 className="mt-8 flex items-center gap-2.5 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:mt-10 md:text-[1.7em]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-brand">
              <Icon name={single.icon} size={19} />
            </span>
            {single.title}
          </h2>
        )}
        {cards.length > 0 && (
          <div className={`${single ? "mt-4" : "mt-8 md:mt-10"} grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4`}>
              {cards.map(({ p, section }) => (
                <Link
                  key={p.slug}
                  to={`/partnery/${p.slug}`}
                  className="group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-pale p-4 transition-transform duration-300 hover:-translate-y-1 md:p-5"
                >
                  <div className="flex items-center gap-3">
                    <PartnerLogo p={p} className="h-11 w-11 shrink-0 rounded-xl p-1.5 text-[1.3em]" />
                    <div className="min-w-0">
                      <div className="font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em]">{p.name}</div>
                      <div className="mt-1 inline-flex items-center gap-1.5 text-[max(12px,0.8em)] font-medium text-foreground/60">
                        <Icon name={section.icon} size={14} />
                        {section.title}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 leading-snug text-foreground/75">{p.tagline}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[max(12px,0.8em)] text-foreground/55">
                    <Icon name="MapPin" size={13} />
                    {p.cities.includes(ALL_RUSSIA) ? "вся Россия" : p.cities.join(", ")}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    {p.promo ? (
                      <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1 text-brand text-[max(12px,0.78em)] font-medium">
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
          </div>
        )}

        {(filter === ALL || EMPTY.some((x) => x.id === filter)) && (
          <div className="mt-12 md:mt-16">
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">Ищем партнёров</h2>
            <p className="mt-2 max-w-[620px] text-muted-foreground">
              Эти разделы пока пустые. Если вы делаете это для ресторанов, заполните анкету, и&nbsp;мы расскажем о&nbsp;вас.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {EMPTY.filter((x) => filter === ALL || x.id === filter).map((x) => (
                <Link
                  key={x.id}
                  to={`/partneram?razdel=${x.id}`}
                  className="group flex items-center gap-3 rounded-[20px] border-2 border-dashed border-foreground/20 p-4 transition-colors hover:border-foreground/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale">
                    <Icon name={x.icon} size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-tight">{x.title}</span>
                    <span className="mt-0.5 block text-[max(12px,0.82em)] text-foreground/55">место свободно</span>
                  </span>
                  <Icon name="Plus" size={18} className="shrink-0 transition-transform group-hover:rotate-90" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {sites.length > 0 && (
          <div className={groups.length > 0 ? "mt-12 md:mt-16" : "mt-8"}>
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
              Полезные сайты
            </h2>
            <p className="mt-2 max-w-[620px] text-muted-foreground">
              Официальные ресурсы, которые стоит держать в&nbsp;закладках каждому, кто работает с&nbsp;Яндекс Едой.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:gap-4">
              {sites.map((u) => (
                <a
                  key={u.url}
                  href={u.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 gap-4 rounded-[20px] bg-pale p-4 md:p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-foreground">
                    <Icon name={u.icon} size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-[1.2em] font-semibold leading-tight tracking-[-0.02em]">{u.name}</span>
                      <Icon name="ArrowUpRight" size={18} className="mt-1 shrink-0 text-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-[max(12px,0.8em)] text-foreground/55">{u.category}</span>
                    <span className="mt-2 block leading-snug text-foreground/75">{u.text}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

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