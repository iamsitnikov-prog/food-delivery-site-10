import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import TermsStrip from "@/components/glossary/TermsStrip";
import Contacts from "@/components/landing/Contacts";
import AggregatorsBlock from "@/components/comparison/AggregatorsBlock";
import BuildersBlock from "@/components/comparison/BuildersBlock";
import useSeo from "@/hooks/use-seo";

const SITE = "https://agregatory.pro";

type Tab = "agregatory" | "konstruktory";

const TABS: { key: Tab; label: string; icon: string; note: string }[] = [
  {
    key: "agregatory",
    label: "Агрегаторы",
    icon: "GitCompare",
    note: "Яндекс Еда, Купер и Чиббис — те, кто приводит новых гостей",
  },
  {
    key: "konstruktory",
    label: "Конструкторы доставки",
    icon: "LayoutGrid",
    note: "STARTER, Sellkit, Смартомато и ФудПикассо — свой канал без комиссии",
  },
];

const FAQ = [
  {
    q: "Чем конструктор доставки отличается от агрегатора?",
    a: "Агрегатор — это витрина с чужой аудиторией: он приводит вам новых гостей и берёт за это процент с каждого заказа. Конструктор делает вам собственный сайт и приложение: комиссии нет, вы платите фиксированную сумму в месяц, но и новых клиентов он не приводит. Это не конкуренты, а разные роли: один привлекает, второй удерживает.",
  },
  {
    q: "Какой агрегатор выгоднее всего для ресторана?",
    a: "Зависит от того, есть ли у вас свои курьеры. Без них выбор сводится к сервисам с курьерским парком, и там выигрывает Яндекс Еда за счёт потока заказов. Со своими курьерами открывается Чиббис со ставкой 17%, но у него кратно меньше аудитория — в крупных городах низкая комиссия не успевает отыграть разницу в объёме.",
  },
  {
    q: "Когда пора запускать собственный канал заказов?",
    a: "Когда появился поток постоянных гостей. Считайте так: плата за платформу делится на комиссию с одного заказа. При чеке 1 200 ₽ и комиссии 30% агрегатор забирает около 360 ₽, значит платформа за 12 000 ₽ окупается примерно на 33 прямых заказах в месяц — это один заказ в день. Порог ниже, чем принято думать.",
  },
  {
    q: "Можно ли полностью отказаться от агрегаторов?",
    a: "На практике так почти никто не делает. Убрав агрегатор, приток новых клиентов придётся обеспечивать рекламой, а это обычно дороже комиссии. Рабочая схема — оба канала: агрегатор для знакомства, своё приложение для повторных заказов.",
  },
  {
    q: "Какой конструктор выбрать?",
    a: "Смотрите не на цену подписки, а на то, какие задачи он закрывает. Если нужен только сайт заказа при минимальном бюджете — подойдут решения начального уровня. Если важно вернуть гостя: мобильное приложение, программа лояльности, база клиентов и рассылки — это уже другой класс платформ, и экономия на подписке здесь обернётся отсутствием результата.",
  },
  {
    q: "Почему цены в калькуляторе приблизительные?",
    a: "Тарифы у платформ меняются, а для сетей и нестандартных задач стоимость считается индивидуально. Поэтому все значения в калькуляторе редактируются: узнали свою цену — впишите её и получите точный расчёт под ваш случай.",
  },
];

const PlayersCompare = () => {
  const { pathname } = useLocation();
  const [tab, setTab] = useState<Tab>("agregatory");

  useSeo({
    title: "Сравнение игроков рынка доставки: агрегаторы и конструкторы | agregatory.pro",
    description:
      "Яндекс Еда, Купер, Чиббис и конструкторы доставки STARTER, Sellkit, Смартомато, ФудПикассо. Комиссии, возможности и окупаемость — с расчётом на ваших цифрах.",
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
            name: "Сравнение игроков",
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
    ],
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">сравнение игроков</span>
          </nav>
          <h1 className="max-w-[18ch] font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
            Сравнение игроков рынка доставки
          </h1>
          <p className="mt-6 max-w-[680px] text-[1.08em] leading-snug text-muted-foreground">
            Две группы сервисов с разными задачами. Агрегаторы приводят новых
            гостей за процент с заказа, конструкторы дают собственный канал без
            комиссии. Разобрали и тех, и других — с расчётом на ваших цифрах.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-[0.92em] font-medium transition-colors ${
                  tab === t.key
                    ? "border-foreground bg-foreground text-brand"
                    : "border-foreground/20 hover:bg-foreground hover:text-brand"
                }`}
              >
                <Icon name={t.icon} size={17} />
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-4 max-w-[600px] text-[0.9em] leading-snug text-muted-foreground">
            {TABS.find((t) => t.key === tab)?.note}
          </p>
        </section>
      </div>

      {tab === "agregatory" ? <AggregatorsBlock /> : <BuildersBlock />}

      <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          частые
          <span className="pl-3 text-muted-foreground">вопросы</span>
        </h2>
        <Accordion
          type="single"
          collapsible
          defaultValue="q-0"
          className="mt-8 border-t border-primary/25"
        >
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.15em] font-semibold hover:no-underline md:text-[1.35em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <TermsStrip slugs={["komissiya", "dostavka-platformy", "marketpleys", "kanal-prodazh", "marzha-zakaza", "samovyvoz"]} />

      <CrossLinks
        items={["reports", "calc", "audit"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PlayersCompare;
