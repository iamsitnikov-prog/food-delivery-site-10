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
    note: "Загрузите файл из личного кабинета — покажем фактические удержания и позиции для проверки",
  },
  {
    key: "anatomy",
    label: "Как читать отчёты",
    icon: "BookOpen",
    note: "Все четыре документа по строкам: значение каждой и её влияние на расчёты",
  },
  {
    key: "reconcile",
    label: "Проверка сходимости",
    icon: "Calculator",
    note: "Перенесите шесть значений из раздела 3 — выполним контроль расчётов",
  },
];

const REASONS = [
  {
    icon: "Percent",
    title: "Ставка в договоре — не вся сумма удержаний",
    text: "Вознаграждение за услуги по заказу — только одна из строк. Рядом идут маркетинговые услуги, абонентская плата за тариф и другие сервисы: они оказываются по отдельным основаниям и в стоимость услуг за заказ не входят. Всё это подключается партнёром добровольно, поэтому итоговая нагрузка на оборот у каждого своя — её и стоит знать.",
  },
  {
    icon: "Wallet",
    title: "Начисленное и перечисленное редко совпадают",
    text: "В отчёте об исполнении поручения сумма к перечислению обычно больше фактически перечисленной. Это не недоплата: разница формирует исходящее сальдо и переходит на следующий период — механика расчётов так и устроена. Полезно просто зафиксировать сумму и убедиться, что она пришла следующим периодом.",
  },
  {
    icon: "FileText",
    title: "Часть удержаний видна только в отчёте",
    text: "Удержания по пункту 14.7 оферты и компенсации гостям отражаются отдельными строками. Если основание кажется спорным, его можно запросить в поддержке — при неподтверждённой вине партнёра удержание снимают. Важно уложиться в срок, указанный в договоре: после подписания отчёта возражения уже не принимаются.",
  },
  {
    icon: "Calculator",
    title: "Итоги в шапке могут показывать нули",
    text: "В информационном отчёте итоговые значения заданы формулами со ссылками на строки заказов. До пересчёта в Excel они отображаются нулями — это особенность файла, а не отсутствие данных. Корректные цифры содержатся в строках ниже.",
  },
];

const FAQ = [
  {
    q: "Вы сохраняете загруженные отчёты?",
    a: "Нет. Файл не покидает ваше устройство: разбор выполняется в браузере средствами самой страницы. Документ не загружается на сервер, не сохраняется, его содержимое недоступно нам и не передаётся третьим лицам. После закрытия вкладки данные удаляются из памяти без следа. По этой же причине разбор выполняется мгновенно и не требует регистрации.",
  },
  {
    q: "Какие отчёты можно загрузить?",
    a: "Четыре типа документов сервиса: отчёт о платёжных поручениях (еженедельный, наиболее детальный), информационный отчёт по заказам (месячный), расшифровку к отчёту с полным составом удержаний и отчёт об исполнении поручения в формате PDF. Файл выгружается из личного кабинета без изменений: пересохранение и редактирование нарушают структуру, и распознавание становится невозможным.",
  },
  {
    q: "Почему фактическая нагрузка выше ставки в договоре?",
    a: "Вознаграждение за услуги по заказу — только одна из строк удержаний. Наряду с ним удерживаются маркетинговые услуги по продвижению, переменная часть абонентской платы, услуга «Буст», вознаграждение за CPA-маркетинг, компенсации гостям и удержания по пунктам оферты. Юридически это самостоятельные услуги по разным основаниям, и в стоимость услуг за заказ они не входят — большинство из них партнёр подключает добровольно. Но для расчётного счёта разницы нет: все они уменьшают поступления. Разбор суммирует удержания и показывает итоговую нагрузку на валовый оборот.",
  },
  {
    q: "Что делать, если суммы не сошлись?",
    a: "Сначала убедитесь, что загружен оригинальный файл за один отчётный период, а не объединённая выгрузка. Если расхождение сохраняется, направьте в поддержку сервиса запрос с указанием периода, номера договора и точной суммы расхождения: обращение со ссылкой на конкретные строки отчёта рассматривается быстрее общей претензии. Отчёт об исполнении поручения до выяснения обстоятельств подписывать не следует.",
  },
  {
    q: "Можно ли оспорить удержания по пункту 14.7 оферты?",
    a: "Да, механизм рабочий. Это удержания за отсутствующую позицию или недовложение: сервис компенсировал гостю стоимость за счёт партнёра. Запросите в поддержке основание, состав заказа и фотоподтверждение. При неподтверждённой вине партнёра удержание снимается, и в следующем отчётном периоде отражается строка возврата по пункту 14.7. Наличие таких строк в расшифровке подтверждает, что возражения рассматриваются по существу.",
  },
  {
    q: "Почему в информационном отчёте итоги показаны нулями?",
    a: "Итоговые значения в шапке заданы формулами со ссылками на строки заказов. Пересчёт выполняется не во всех средах: при открытии в браузере, в мобильном приложении или стороннем редакторе формулы остаются невычисленными. Нулевые итоги не означают отсутствия заказов — данные в строках ниже корректны. Разбор на этой странице выполняет расчёт непосредственно по строкам заказов.",
  },
  {
    q: "Как часто нужно проверять отчёты?",
    a: "Отчёт о платёжных поручениях поступает еженедельно — достаточно сверять итоговые суммы с поступлениями на расчётный счёт. Отчёт об исполнении поручения проверяется обязательно и до подписания: по истечении срока, установленного договором, мотивированные возражения не принимаются, и удержания считаются согласованными. Регулярный контроль окупается первым же снятым удержанием.",
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
            text: "Выгрузите из личного кабинета сервиса отчёт о платёжных поручениях или отчёт об исполнении поручения без изменений.",
          },
          {
            "@type": "HowToStep",
            name: "Посчитать реальные удержания",
            text: "Просуммируйте все удержания, включая маркетинговые услуги, абонентскую плату и удержания по оферте, и разделите на валовый оборот.",
          },
          {
            "@type": "HowToStep",
            name: "Сверить с поступлениями",
            text: "Сумма транзакций по отчёту должна совпадать с суммой платёжных поручений до копейки.",
          },
          {
            "@type": "HowToStep",
            name: "Проверить сальдо",
            text: "Входящее сальдо плюс сумма к перечислению минус фактически перечислено должно давать исходящее сальдо.",
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
          Загрузите отчёт из личного кабинета сервиса — покажем фактическую
          нагрузку на оборот, состав удержаний и позиции, по которым стоит
          уточнить основание. Файл обрабатывается в браузере и не передаётся
          на сервер.
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
          зачем
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
                Разбор выполняется в браузере на вашем устройстве. Файл не
                передаётся на сервер ни целиком, ни фрагментами.
              </p>
            </div>
            <div>
              <h3 className="font-display text-[1.15em] font-semibold text-brand">
                Ничего не хранится
              </h3>
              <p className="mt-2.5 leading-relaxed text-cream-muted">
                Содержимое отчёта нам недоступно: ни обороты, ни реквизиты, ни
                наименования точек. Сохранять нечего.
              </p>
            </div>
            <div>
              <h3 className="font-display text-[1.15em] font-semibold text-brand">
                Закрыли вкладку — всё исчезло
              </h3>
              <p className="mt-2.5 leading-relaxed text-cream-muted">
                Данные существуют только в памяти открытой страницы. Копии,
                журналы и следы после закрытия не сохраняются.
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

      <CrossLinks
        items={["audit", "calc", "compare"]}
        title="что дальше"
        subtitle="после разбора"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default ReportsDecoder;