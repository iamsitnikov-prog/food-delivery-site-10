import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { READ_CHANNELS } from "@/data/channels";
import { reachGoal } from "@/lib/metrika";

const ReadPage = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Почитать о доставке: наши каналы и блог | agregatory.pro",
    description:
      "Telegram-каналы и Дзен о работе ресторанов с агрегаторами: разборы обновлений, механики акций, рейтинг и отзывы, экономика доставки.",
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
            name: "Почитать",
            item: "https://agregatory.pro/pochitat",
          },
        ],
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
            <span className="text-foreground">почитать</span>
          </nav>
          <h1 className="max-w-[16ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Почитать о доставке
          </h1>
          <p className="mt-6 max-w-[640px] text-[1.08em] leading-snug text-muted-foreground">
            Пишем о том, как устроены агрегаторы изнутри: обновления сервисов, механики акций,
            работа с рейтингом и честная экономика доставки. Без продающей воды.
          </p>
        </section>
      </div>

      <section className="px-5 pb-14 md:px-14 md:pb-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {READ_CHANNELS.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => reachGoal("channel_click", { channel: c.id, source: "read-page" })}
              className="group flex flex-col rounded-[28px] bg-surface p-7 text-cream transition-transform hover:-translate-y-1 md:p-8"
            >
              <div className="flex items-center gap-2.5">
                <Icon name={c.icon} size={24} className="text-brand" />
                <span className="rounded-lg bg-cream/10 px-2.5 py-1 text-[0.78em] font-medium text-cream-muted">
                  {c.handle}
                </span>
              </div>
              <h2 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                {c.label}
              </h2>
              <p className="mt-1.5 text-[0.88em] text-cream-muted">{c.author}</p>
              <p className="mt-3 flex-1 leading-relaxed text-cream-muted">{c.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium text-brand">
                открыть
                <Icon name="ArrowUpRight" size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="rounded-[28px] bg-surface p-7 text-cream md:p-10">
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em] md:text-[1.9em]">
            Что ещё почитать на сайте
          </h2>
          <p className="mt-3 max-w-[620px] leading-relaxed text-cream-muted">
            Помимо каналов у нас есть блог с подробными разборами, бесплатные калькуляторы и
            чек-листы — всё открыто и без регистрации.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { to: "/blog", icon: "Newspaper", label: "блог", note: "Подробные разборы и инструкции" },
              {
                to: "/kalkulyatory",
                icon: "Calculator",
                label: "калькуляторы",
                note: "Посчитать экономику на своих цифрах",
              },
              {
                to: "/chek-listy",
                icon: "ListChecks",
                label: "чек-листы",
                note: "Пошаговые списки с сохранением прогресса",
              },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-2xl border border-cream/15 p-5 transition-colors hover:border-brand hover:bg-brand/10"
              >
                <Icon name={l.icon} size={20} className="text-brand" />
                <span className="mt-3 block font-display text-[1.05em] font-semibold">
                  {l.label}
                </span>
                <span className="mt-1.5 block text-[0.88em] leading-snug text-cream-muted">
                  {l.note}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default ReadPage;
