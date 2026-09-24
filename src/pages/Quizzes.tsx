import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { QUIZZES } from "@/data/quizzes";

const QuizzesPage = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Тесты для ресторанов на агрегаторах доставки | agregatory.pro",
    description:
      "Бесплатные тесты: экспресс-аудит заведения, знание кабинета Яндекс Еды, экономика доставки, качество и рейтинг, требования 289-ФЗ. С разбором ответов.",
    path: pathname,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://agregatory.pro/" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Тесты",
            item: "https://agregatory.pro/testy",
          },
        ],
      },
    ],
  });

  const audit = QUIZZES.filter((q) => q.kind === "audit");
  const knowledge = QUIZZES.filter((q) => q.kind === "knowledge");

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
            <span className="text-foreground">тесты</span>
          </nav>
          <h1 className="max-w-[16ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Тесты о работе с агрегаторами
          </h1>
          <p className="mt-6 max-w-[640px] text-[1.08em] leading-snug text-muted-foreground">
            Проверьте своё заведение или собственные знания. Все тесты бесплатны, регистрация
            не&nbsp;нужна, в&nbsp;конце&nbsp;— разбор результата и&nbsp;рекомендации.
          </p>
        </section>
      </div>

      <section className="px-5 pb-14 md:px-14 md:pb-16">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
          экспресс-аудит
        </h2>
        <p className="mt-2 max-w-[560px] leading-snug text-muted-foreground">
          Отвечайте о том, как всё устроено у вас сейчас — получите оценку проекта.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {audit.map((q) => (
            <Link
              key={q.slug}
              to={`/testy/${q.slug}`}
              className="group rounded-[28px] bg-foreground p-7 text-brand transition-transform hover:-translate-y-1 md:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <Icon name={q.icon} size={26} />
                <span className="rounded-lg bg-brand/15 px-2.5 py-1 text-[0.78em] font-medium">
                  {q.minutes}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                {q.navLabel}
              </h3>
              <p className="mt-3 leading-relaxed text-brand/75">{q.lead}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium">
                пройти тест
                <Icon name="ArrowRight" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
          проверка знаний
        </h2>
        <p className="mt-2 max-w-[600px] leading-snug text-muted-foreground">
          По 50 вопросов в каждом: правила сервиса, экономика, стандарты качества и требования
          закона. С пояснениями к ответам.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {knowledge.map((q) => (
            <Link
              key={q.slug}
              to={`/testy/${q.slug}`}
              className="group rounded-[28px] bg-surface p-7 text-cream transition-transform hover:-translate-y-1 md:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <Icon name={q.icon} size={26} className="text-brand" />
                <span className="rounded-lg bg-cream/10 px-2.5 py-1 text-[0.78em] font-medium text-cream-muted">
                  {q.questions.length} вопросов
                </span>
              </div>
              <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                {q.navLabel}
              </h3>
              <p className="mt-3 leading-relaxed text-cream-muted">{q.lead}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium text-brand">
                пройти тест
                <Icon name="ArrowRight" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default QuizzesPage;
