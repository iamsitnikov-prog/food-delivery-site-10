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
import Contacts from "@/components/landing/Contacts";
import CalcSwitcher from "@/components/calc/CalcSwitcher";
import BuildersCalc, { BUILDERS } from "@/components/calc/BuildersCalc";
import useSeo from "@/hooks/use-seo";

const SITE = "https://agregatory.pro";
const PATH = "/kalkulyatory/konstruktory-dostavki";

const FAQ = [
  {
    q: "Что такое конструктор доставки и зачем он нужен?",
    a: "Это платформа, которая делает вам собственный сайт заказа и мобильное приложение под вашим брендом. Гость заказывает напрямую у вас, а не через агрегатор, поэтому комиссия с заказа не удерживается — вы платите платформе фиксированную сумму в месяц. Главное отличие от агрегатора: конструктор не приводит новых клиентов, он позволяет удержать тех, кто у вас уже заказывал.",
  },
  {
    q: "Когда собственный канал начинает окупаться?",
    a: "Считайте так: месячная плата за платформу делится на среднюю комиссию с одного заказа. При чеке 1 200 ₽ и комиссии 30% агрегатор забирает около 360 ₽ с заказа, значит платформа за 12 000 ₽ окупается примерно на 33 прямых заказах в месяц — это один заказ в день. Всё, что сверх этого, остаётся у вас. Калькулятор выше считает эту точку на ваших цифрах.",
  },
  {
    q: "Можно ли полностью отказаться от агрегаторов?",
    a: "На практике так почти никто не делает. Агрегатор — это витрина, на которой вас находят новые гости, а собственное приложение удерживает тех, кто уже пробовал вашу кухню. Если убрать агрегатор, приток новых клиентов придётся обеспечивать рекламой, и это обычно дороже комиссии. Рабочая схема — оба канала одновременно.",
  },
  {
    q: "Какой конструктор выбрать?",
    a: "Если нужен только сайт заказа и бюджет ограничен — смотрите на решения с низким порогом входа вроде Смартомато или ФудПикассо. Если важны мобильное приложение, программа лояльности и работа с базой гостей — это STARTER и Sellkit. Для сети из нескольких точек стоимость почти всегда считается индивидуально, поэтому запрашивайте расчёт под себя.",
  },
  {
    q: "Почему цены в калькуляторе приблизительные?",
    a: "Тарифы у платформ меняются, а для сетей и нестандартных задач стоимость считается индивидуально. Поэтому все значения в калькуляторе можно отредактировать: узнали свою цену — впишите её и получите точный расчёт именно под ваш случай.",
  },
  {
    q: "Что ещё учесть кроме стоимости платформы?",
    a: "Три вещи. Первое: своя доставка — курьеров нужно либо нанимать, либо подключать стороннюю службу. Второе: перевод гостей в свой канал требует работы — промо в упаковке, программа лояльности, рассылки. Третье: интеграция с вашей кассовой системой, iiko или r_keeper, иначе заказы придётся вбивать вручную.",
  },
];

const BuildersCompare = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Сравнение конструкторов доставки для ресторана | agregatory.pro",
    description:
      "Sellkit, STARTER, Смартомато и ФудПикассо: стоимость, возможности и окупаемость. Калькулятор покажет, сколько вы сэкономите на комиссии со своим приложением и сайтом заказа.",
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
            name: "Калькуляторы и сравнения",
            item: `${SITE}/kalkulyatory`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Конструкторы доставки",
            item: `${SITE}${PATH}`,
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
        name: "Конструкторы доставки для ресторанов",
        itemListElement: BUILDERS.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          description: b.tagline,
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
            className="mb-8 flex flex-wrap items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/kalkulyatory" className="hover:text-foreground">
              калькуляторы и сравнения
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">конструкторы доставки</span>
          </nav>
          <h1 className="max-w-[20ch] font-display text-[34px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
            Сравнение конструкторов доставки
          </h1>
          <p className="mt-6 max-w-[660px] text-[1.08em] leading-snug text-muted-foreground">
            Sellkit, STARTER, Смартомато и ФудПикассо делают вам свой сайт
            заказа и приложение. Посчитайте, сколько вы сэкономите на комиссии и
            с какого объёма это окупается.
          </p>
          <div className="mt-8">
            <CalcSwitcher active={PATH} />
          </div>
        </section>
      </div>

      <section className="px-5 pb-14 md:px-14 md:pb-20">
        <BuildersCalc />
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          сильные и слабые
          <span className="pl-3 text-muted-foreground">стороны</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {BUILDERS.map((b) => (
            <article
              key={b.slug}
              className="rounded-[28px] bg-surface p-7 text-cream md:p-8"
            >
              <h3 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.02em]">
                {b.name}
              </h3>
              <p className="mt-1.5 text-[0.9em] leading-snug text-brand">
                {b.tagline}
              </p>
              <p className="mt-4 text-[0.88em] leading-snug text-cream-muted">
                Ориентир по цене: от {new Intl.NumberFormat("ru-RU").format(b.fee)} ₽
                в месяц. {b.feeNote}.
              </p>

              <ul className="mt-5 space-y-2.5">
                {b.strong.map((s) => (
                  <li key={s} className="flex gap-2.5 text-[0.92em] leading-snug">
                    <Icon name="Plus" size={16} className="mt-0.5 shrink-0 text-brand" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-2.5 border-t border-cream/12 pt-5">
                {b.weak.map((s) => (
                  <li
                    key={s}
                    className="flex gap-2.5 text-[0.92em] leading-snug text-cream-muted"
                  >
                    <Icon name="Minus" size={16} className="mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              {b.url && (
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[0.9em] font-medium text-brand hover:underline"
                >
                  перейти на сайт
                  {b.promo && ` · промокод ${b.promo}`}
                  <Icon name="ArrowUpRight" size={16} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[820px] px-5 pb-16 md:px-14 md:pb-24">
        <p className="mb-5 text-[1.05em] leading-relaxed text-foreground/85">
          Собственный канал заказов решает одну задачу — перестать платить
          процент с гостей, которые и так знают ваше заведение. Агрегатор берёт
          комиссию с каждого заказа независимо от того, нашёл он вам этого
          клиента или тот пришёл сам. Конструктор меняет модель: вы платите
          фиксированную сумму, и она не растёт вместе с оборотом.
        </p>
        <p className="mb-5 text-[1.05em] leading-relaxed text-foreground/85">
          Но есть обратная сторона, о которой продавцы платформ говорят редко.
          Свой сайт и приложение не приводят новых гостей — их нужно привести
          туда самостоятельно. Агрегатор остаётся витриной для первого знакомства,
          а свой канал подхватывает повторные заказы. Поэтому вопрос звучит не
          «что выбрать», а «когда добавить второе к первому».
        </p>
        <p className="mb-5 text-[1.05em] leading-relaxed text-foreground/85">
          Точка входа считается просто: плата за платформу делится на комиссию,
          которую вы платите с одного заказа. Получится число прямых заказов в
          месяц, после которого канал начинает приносить деньги. Обычно это
          один-два заказа в день — порог ниже, чем принято думать, и именно
          поэтому конструкторы стали массовыми.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
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

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default BuildersCompare;
