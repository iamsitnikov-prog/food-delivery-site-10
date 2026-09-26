import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import ChannelCalc from "@/components/comparison/ChannelCalc";
import ChannelPicker from "@/components/comparison/ChannelPicker";
import useSeo from "@/hooks/use-seo";
import {
  AGGREGATORS,
  COMPARISON_ROWS,
  SCENARIOS,
  CONCLUSIONS,
} from "@/data/comparison";

const SITE = "https://agregatory.pro";

const FAQ = [
  {
    q: "Какой агрегатор выгоднее всего для ресторана?",
    a: "Зависит от того, есть ли у вас свои курьеры. При своей доставке самая низкая комиссия у Чиббиса — от 17%. Без курьеров выбор сводится к Яндекс Еде или Куперу с комиссией около 35%, и тогда выигрывает тот, кто даст больше заказов — обычно это Яндекс.",
  },
  {
    q: "Можно ли работать сразу на нескольких агрегаторах?",
    a: "Да, и чаще всего это выгодно: аудитории сервисов пересекаются слабо, поэтому второй канал добавляет заказы, а не забирает их у первого. Ограничение только операционное — кухня должна выдерживать суммарный поток без роста отмен.",
  },
  {
    q: "Почему комиссия отличается в полтора раза?",
    a: "Ставка зависит от того, кто везёт заказ. Доставка силами сервиса стоит около 35%, своя доставка — около 20%. Разница покрывает содержание курьерского парка, который иначе пришлось бы оплачивать вам напрямую.",
  },
  {
    q: "Подойдёт ли Чиббис в Москве или Петербурге?",
    a: "Формально он работает в крупных городах, но объём заказов там заметно ниже, чем у Яндекса. В миллионниках Чиббис имеет смысл как дополнительный канал с дешёвой комиссией, а не как основной источник трафика.",
  },
  {
    q: "Что выгоднее: низкая комиссия или большой трафик?",
    a: "Считать нужно в рублях прибыли, а не в процентах комиссии. Канал с комиссией 17% и десятью заказами в день принесёт меньше, чем канал с 35% и пятьюдесятью заказами. Прогоните оба варианта через калькулятор рентабельности на своих цифрах.",
  },
];

type Filter = "all" | "service" | "own";

const FILTERS: { key: Filter; label: string; note: string }[] = [
  { key: "all", label: "все агрегаторы", note: "Три площадки для приёма заказов" },
  {
    key: "service",
    label: "курьеры сервиса",
    note: "Логистику берёт на себя площадка — комиссия выше",
  },
  {
    key: "own",
    label: "своя доставка",
    note: "Везёте сами, поэтому ставка ниже или её нет совсем",
  },
];

const Comparison = () => {
  const { pathname } = useLocation();
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    if (filter === "service")
      return AGGREGATORS.filter(
        (a) => a.commissionCourier !== "нет своих курьеров",
      );
    if (filter === "own")
      return AGGREGATORS.filter((a) => a.commissionSelf !== "нет своих курьеров");
    return AGGREGATORS;
  }, [filter]);

  useSeo({
    title: "Яндекс Еда, Купер или Чиббис: что выгоднее ресторану | agregatory.pro",
    description:
      "Сравнение агрегаторов доставки для ресторанов: комиссии, география, курьеры, сроки подключения. Калькулятор прибыли, разбор по сценариям и честные выводы.",
    path: pathname,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Сравнение агрегаторов",
            item: `${SITE}/sravnenie-agregatorov`,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Агрегаторы доставки для ресторанов",
        itemListElement: AGGREGATORS.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
          description: a.tagline,
        })),
      },
    ],
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">сравнение агрегаторов</span>
          </nav>
          <h1 className="max-w-[20ch] font-display text-[36px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
            Яндекс Еда, Купер или Чиббис: что выгоднее ресторану
          </h1>
          <p className="mt-6 max-w-[660px] text-[1.08em] leading-snug text-muted-foreground">
            Сравнили три агрегатора по комиссиям, географии и логистике. Без рекламы сервисов:
            только цифры, калькулятор на ваших данных и честные выводы, кому что подходит.
          </p>
        </section>
      </div>

      <section className="px-5 pb-14 md:px-14 md:pb-20">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-xl px-4 py-2.5 text-[0.9em] font-medium transition-colors ${
                filter === f.key
                  ? "bg-foreground text-background"
                  : "border border-foreground/15 text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="w-full text-[0.85em] leading-snug text-muted-foreground md:w-auto md:pl-2">
            {FILTERS.find((f) => f.key === filter)?.note}
          </span>
        </div>
        <div className="overflow-x-auto rounded-[28px] bg-surface p-2 md:p-4">
          <table className="w-full min-w-[720px] border-collapse text-cream">
            <thead>
              <tr>
                <th className="w-[210px] p-4 text-left align-bottom text-[0.85em] font-normal text-cream-muted">
                  Параметр
                </th>
                {shown.map((a) => (
                  <th key={a.slug} className="p-4 text-left align-bottom">
                    <span className="block font-display text-[1.2em] font-semibold leading-tight">
                      {a.name}
                    </span>
                    <span className="mt-1.5 block text-[0.8em] font-normal leading-snug text-brand">
                      {a.tagline}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key} className="border-t border-cream/12">
                  <th className="p-4 text-left align-top text-[0.9em] font-medium text-cream-muted">
                    {row.label}
                  </th>
                  {shown.map((a) => (
                    <td
                      key={a.slug}
                      className="p-4 align-top text-[0.92em] leading-snug text-cream"
                    >
                      {a[row.key] as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ChannelCalc />

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          сильные и слабые
          <span className="pl-3 text-muted-foreground">стороны</span>
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {AGGREGATORS.map((a) => (
            <article key={a.slug} className="rounded-[28px] bg-surface p-7 text-cream md:p-8">
              <h3 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.02em]">
                {a.name}
              </h3>

              <ul className="mt-5 space-y-2.5">
                {a.strong.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[0.92em] leading-snug">
                    <Icon name="Plus" size={16} className="mt-0.5 shrink-0 text-brand" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-2.5 border-t border-cream/12 pt-5">
                {a.weak.map((s) => (
                  <li
                    key={s}
                    className="flex gap-2.5 text-[0.92em] leading-snug text-cream-muted"
                  >
                    <Icon name="Minus" size={16} className="mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-2xl bg-cream/[0.06] p-4 text-[0.9em] leading-snug">
                <span className="text-brand">Кому подходит. </span>
                {a.bestFor}
              </p>
            </article>
          ))}
        </div>
      </section>

      <ChannelPicker />

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          разборы
          <span className="pl-3 text-muted-foreground">типичных ситуаций</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SCENARIOS.map((s) => (
            <article
              key={s.title}
              className="rounded-[28px] border border-foreground/12 p-7 md:p-8"
            >
              <h3 className="font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.situation}</p>
              <p className="mt-4 leading-relaxed">{s.verdict}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[0.9em] font-medium text-foreground">
                <Icon name="Trophy" size={16} />
                {s.winner}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="rounded-[32px] bg-surface p-7 text-cream md:p-12">
          <h2 className="font-display text-[30px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[44px]">
            выводы
          </h2>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            {CONCLUSIONS.map((c) => (
              <div key={c.h}>
                <h3 className="font-display text-[1.2em] font-semibold text-brand">{c.h}</h3>
                <p className="mt-2.5 leading-relaxed text-cream-muted">{c.p}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/kalkulyatory/rentabelnost-zakaza"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              посчитать рентабельность
              <Icon name="ArrowRight" size={18} />
            </Link>
            <Link
              to="/kalkulyatory/model-dostavki"
              className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-5 py-3.5 text-cream transition-colors hover:border-cream/60"
            >
              сравнить модели доставки
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          частые
          <span className="pl-3 text-muted-foreground">вопросы</span>
        </h2>
        <div className="mt-8 border-t border-primary/25">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-primary/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-display text-[1.15em] font-semibold md:text-[1.35em]">
                {f.q}
                <Icon
                  name="ChevronDown"
                  size={20}
                  className="shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default Comparison;