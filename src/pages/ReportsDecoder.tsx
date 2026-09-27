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
import Contacts from "@/components/landing/Contacts";
import ReportUploader from "@/components/reports/ReportUploader";
import ReportAnatomy from "@/components/reports/ReportAnatomy";
import ReconcileCalc from "@/components/reports/ReconcileCalc";
import useSeo from "@/hooks/use-seo";

const SITE = "https://agregatory.pro";

type Mode = "upload" | "anatomy" | "reconcile";

const MODES: { key: Mode; label: string; icon: string; note: string }[] = [
  {
    key: "upload",
    label: "Разобрать свой отчёт",
    icon: "FileUp",
    note: "Загрузите файл из кабинета — покажем, сколько реально удержали и что проверить",
  },
  {
    key: "anatomy",
    label: "Как читать отчёты",
    icon: "BookOpen",
    note: "Разбор всех четырёх документов по строкам: что значит каждая и на что влияет",
  },
  {
    key: "reconcile",
    label: "Проверка сходимости",
    icon: "Calculator",
    note: "Перепишите шесть чисел из отчёта — проверим, сходится ли и где разница",
  },
];

const REASONS = [
  {
    icon: "Percent",
    title: "Комиссия в договоре — не то, что удержат",
    text: "В договоре стоит одна ставка, а по факту с оборота уходит заметно больше. Продвижение, подписка, буст и штрафы считаются отдельными услугами и в «комиссию» не входят — но платите их вы. На реальном недельном отчёте это выглядело как 28,5% по договору против 43,4% по факту.",
  },
  {
    icon: "Wallet",
    title: "«Подлежит» и «перечислено» почти никогда не совпадают",
    text: "В отчёте об исполнении поручения две большие суммы, и вторая меньше первой. Это не недоплата: разница уходит в исходящее сальдо и приходит в следующем периоде. Но проверить, что она действительно пришла, кроме вас никто не станет.",
  },
  {
    icon: "FileWarning",
    title: "Штрафы списываются молча",
    text: "Удержания по пункту 14.7 оферты и компенсации гостям появляются в отчёте отдельными строками. Их можно оспорить через поддержку, но только пока не вышел срок из договора. Подписали отчёт — согласились со всем, что в нём есть.",
  },
  {
    icon: "Calculator",
    title: "Нули в шапке вместо итогов",
    text: "В месячном отчёте итоговые суммы сделаны формулами. Пока Excel их не пересчитает, вы видите нули и думаете, что файл пустой. Настоящие цифры лежат в строках заказов ниже.",
  },
];

const FAQ = [
  {
    q: "Вы сохраняете загруженные отчёты?",
    a: "Нет. Файл вообще не покидает ваш компьютер: разбор происходит прямо в браузере средствами самой страницы. Мы не загружаем документ на сервер, не храним его, не видим содержимое и не передаём третьим лицам. Закроете вкладку — данные исчезнут без следа. Именно поэтому разбор работает мгновенно и без регистрации.",
  },
  {
    q: "Какие отчёты можно загрузить?",
    a: "Четыре типа документов площадки: отчёт по платёжным поручениям (недельный, самый подробный), информационный отчёт по заказам (месячный), расшифровку к отчёту с полным составом удержаний и отчёт об исполнении поручения в формате PDF. Файл нужно брать из кабинета как есть, не пересохраняя и не редактируя — иначе структура ломается.",
  },
  {
    q: "Почему реальный процент удержаний выше, чем в договоре?",
    a: "Потому что комиссия — только одна из строк удержаний. Рядом с ней идут платное продвижение, переменная часть подписки, услуга «Буст», CPA-маркетинг, компенсации гостям и штрафы по офертам. Формально это отдельные услуги, юридически — не комиссия, но с точки зрения вашего расчётного счёта разницы нет: деньги уходят одинаково. Разборщик складывает всё и показывает итоговую нагрузку на оборот.",
  },
  {
    q: "Что делать, если суммы не сошлись?",
    a: "Сначала убедитесь, что загружен оригинальный файл за один период, а не склейка из нескольких. Если расхождение осталось, напишите в поддержку площадки с указанием периода, номера договора и конкретной суммы расхождения — запрос со ссылкой на строки отчёта отрабатывают быстрее общей претензии. Отчёт об исполнении поручения до выяснения лучше не подписывать.",
  },
  {
    q: "Можно ли оспорить удержания по пункту 14.7?",
    a: "Да, и на практике это работает. Это штрафы за отсутствующую позицию или недовложение — площадка вернула деньги гостю за ваш счёт. Запросите в поддержке детали заказа и фотографии: если вина кухни не подтверждается, удержание снимают, и в следующем отчёте появляется строка возврата. Наличие таких строк в расшифровке — прямое доказательство, что механизм рабочий.",
  },
  {
    q: "Почему в месячном отчёте итоги показаны нулями?",
    a: "В шапке файла стоят формулы, которые ссылаются на строки ниже. Excel пересчитывает их не всегда — особенно при открытии в браузере, в мобильном приложении или в стороннем редакторе. Нули в шапке не означают, что заказов не было: сумма по строкам ниже считается корректно. Разборщик на этой странице считает сам по строкам и показывает настоящие цифры.",
  },
  {
    q: "Как часто нужно проверять отчёты?",
    a: "Отчёт по платёжным поручениям приходит еженедельно, его достаточно бегло сверять с поступлениями на счёт. Месячный отчёт об исполнении поручения проверять нужно обязательно и до подписания: после истечения срока, указанного в договоре, претензии по нему не принимаются. Пятнадцать минут раз в месяц окупаются первым же снятым штрафом.",
  },
];

const ReportsDecoder = () => {
  const { pathname } = useLocation();
  const [mode, setMode] = useState<Mode>("upload");

  useSeo({
    title: "Разбор отчётов агрегаторов: платёжные поручения и отчёт по заказам | agregatory.pro",
    description:
      "Загрузите отчёт Яндекс Еды или Деливери — покажем реальный процент удержаний, разбивку по типам и сходимость с платёжками. Файл не покидает браузер. Плюс инструкция, как читать каждый отчёт.",
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
            name: "Разбор отчётов",
            item: `${SITE}/razbor-otchetov`,
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
        "@type": "HowTo",
        name: "Как проверить отчёт агрегатора",
        step: [
          {
            "@type": "HowToStep",
            name: "Скачать отчёт",
            text: "Выгрузите из кабинета площадки отчёт по платёжным поручениям или отчёт об исполнении поручения без изменений.",
          },
          {
            "@type": "HowToStep",
            name: "Посчитать реальные удержания",
            text: "Сложите все удержания, включая продвижение, подписку и штрафы, и разделите на оборот — получите фактическую нагрузку.",
          },
          {
            "@type": "HowToStep",
            name: "Сверить с поступлениями",
            text: "Сумма строк отчёта должна совпадать с суммой платёжных поручений до копейки.",
          },
          {
            "@type": "HowToStep",
            name: "Проверить сальдо",
            text: "Входящее сальдо плюс подлежит к перечислению минус фактически перечислено должно давать исходящее сальдо.",
          },
        ],
      },
    ],
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
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
          <span className="text-foreground">разбор отчётов</span>
        </nav>

        <h1 className="max-w-[19ch] font-display text-[36px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
          Разбор отчётов агрегаторов
        </h1>
        <p className="mt-6 max-w-[700px] text-[1.08em] leading-snug text-muted-foreground">
          Загрузите отчёт из кабинета площадки — покажем, сколько на самом деле
          удержали, куда ушли деньги и что стоит оспорить. Файл не уходит на
          сервер: весь разбор происходит в вашем браузере.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={mode === m.key}
              onClick={() => setMode(m.key)}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-[0.92em] font-medium transition-colors ${
                mode === m.key
                  ? "border-foreground bg-foreground text-brand"
                  : "border-foreground/20 hover:bg-foreground hover:text-brand"
              }`}
            >
              <Icon name={m.icon} size={17} />
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-4 max-w-[620px] text-[0.9em] leading-snug text-muted-foreground">
          {MODES.find((m) => m.key === mode)?.note}
        </p>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        {mode === "upload" && <ReportUploader />}
        {mode === "anatomy" && <ReportAnatomy />}
        {mode === "reconcile" && <ReconcileCalc />}
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          зачем вообще
          <span className="pl-3 text-muted-foreground">это проверять</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {REASONS.map((r) => (
            <article
              key={r.title}
              className="rounded-[28px] border border-foreground/12 p-7 md:p-8"
            >
              <Icon name={r.icon} size={26} className="text-[#C7161B]" />
              <h3 className="mt-4 font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">
                {r.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="rounded-[32px] bg-surface p-7 text-cream md:p-12">
          <Icon name="ShieldCheck" size={34} className="text-brand" />
          <h2 className="mt-5 max-w-[20ch] font-display text-[28px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[40px]">
            Ваши файлы остаются у вас
          </h2>
          <div className="mt-7 grid gap-7 md:grid-cols-3">
            <div>
              <h3 className="font-display text-[1.15em] font-semibold text-brand">
                Ничего не загружается
              </h3>
              <p className="mt-2.5 leading-relaxed text-cream-muted">
                Разбор идёт прямо в браузере на вашем устройстве. Файл не
                отправляется на сервер — ни целиком, ни частями.
              </p>
            </div>
            <div>
              <h3 className="font-display text-[1.15em] font-semibold text-brand">
                Ничего не хранится
              </h3>
              <p className="mt-2.5 leading-relaxed text-cream-muted">
                Мы не видим содержимое отчёта: ни обороты, ни ИНН, ни названия
                точек. Хранить нам просто нечего.
              </p>
            </div>
            <div>
              <h3 className="font-display text-[1.15em] font-semibold text-brand">
                Закрыли вкладку — всё исчезло
              </h3>
              <p className="mt-2.5 leading-relaxed text-cream-muted">
                Данные живут только в памяти открытой страницы. Никаких копий,
                логов и следов после закрытия не остаётся.
              </p>
            </div>
          </div>
        </div>
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

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="rounded-[32px] bg-surface p-7 text-cream md:p-12">
          <h2 className="max-w-[18ch] font-display text-[26px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[36px]">
            Разобрались с отчётом — посчитайте экономику целиком
          </h2>
          <p className="mt-4 max-w-[580px] leading-relaxed text-cream-muted">
            Отчёт показывает, сколько забрала площадка. Калькуляторы покажут,
            сколько остаётся после себестоимости, зарплат и налогов — и стоит ли
            запускать собственный канал заказов.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/kalkulyatory/rentabelnost-zakaza"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              рентабельность заказа
              <Icon name="ArrowRight" size={18} />
            </Link>
            <Link
              to="/sravnenie-agregatorov"
              className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-5 py-3.5 text-cream transition-colors hover:border-cream/60"
            >
              сравнение игроков
            </Link>
          </div>
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default ReportsDecoder;
