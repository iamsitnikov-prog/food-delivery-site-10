import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import Calculator from "@/components/calc/Calculator";
import CalcSwitcher from "@/components/calc/CalcSwitcher";
import CompareCalc from "@/components/calc/CompareCalc";
import useSeo from "@/hooks/use-seo";
import { VISIBLE_CALC_PAGES, CALC_PAGES } from "@/data/calculators";

const CalcPreview = () => {
  const [active, setActive] = useState<string | null>(null);

  useSeo({
    title: "Калькуляторы — предпросмотр",
    description: "Закрытый предпросмотр калькуляторов экономики доставки.",
    path: "/preview/kalkulyatory-a7f3k9",
  });

  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => {
      document.head.removeChild(tag);
    };
  }, []);

  const page = active ? CALC_PAGES.find((p) => p.slug === active) : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="border-b border-foreground/10 px-5 py-4 md:px-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[max(12px,0.85em)] font-medium text-muted-foreground">
            <Icon name="Eye" size={16} />
            предпросмотр · калькуляторы
          </span>
          {page && (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="inline-flex items-center gap-2 text-[max(12px,0.88em)] font-medium text-foreground hover:text-muted-foreground"
            >
              <Icon name="ArrowLeft" size={15} />
              ко всем калькуляторам
            </button>
          )}
        </div>
      </div>

      {!page ? (
        <>
          <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
            <h1 className="max-w-[17ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
              Калькуляторы экономики доставки
            </h1>
            <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
              Введите свои цифры один раз&nbsp;— увидите рентабельность заказа, ДРР, окупаемость
              канала и&nbsp;порог по&nbsp;НДС. Данные никуда не&nbsp;отправляются.
            </p>

            <div className="mt-8">
              <CalcSwitcher active="" onSelect={(slug) => setActive(slug || null)} />
            </div>
          </section>

          <section className="px-5 pb-11 md:px-14 md:pb-24">
            <Calculator mode="all" hideCta />
          </section>

          <section className="px-5 pb-11 md:px-14 md:pb-24">
            <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
              отдельные
              <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">калькуляторы</span>
            </h2>
            <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
              {VISIBLE_CALC_PAGES.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActive(p.slug)}
                  className={`group relative rounded-[28px] p-7 text-left transition-transform hover:-translate-y-1 md:p-8 ${
                    p.accent ? "bg-[#C7161B] text-white" : "bg-surface text-cream"
                  }`}
                >
                  {p.accent && (
                    <span className="absolute right-6 top-6 rounded-lg bg-white/15 px-2.5 py-1 text-[max(12px,0.72em)] font-bold uppercase tracking-wide">
                      новое
                    </span>
                  )}
                  <Icon
                    name={p.icon}
                    size={26}
                    className={p.accent ? "text-white" : "text-brand"}
                  />
                  <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                    {p.navLabel}
                  </h3>
                  <p
                    className={`mt-3 leading-relaxed ${p.accent ? "text-white/80" : "text-cream-muted"}`}
                  >
                    {p.lead}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium ${
                      p.accent ? "text-white" : "text-brand"
                    }`}
                  >
                    открыть
                    <Icon name="ArrowRight" size={16} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
            <h1 className="max-w-[18ch] font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
              {page.lead}
            </p>

            <div className="mt-8">
              <CalcSwitcher active={page.slug} onSelect={(slug) => setActive(slug || null)} />
            </div>
          </section>

          <section className="px-5 pb-11 md:px-14 md:pb-24">
            {page.mode === "compare" ? <CompareCalc hideCta /> : <Calculator mode={page.mode} hideCta />}
          </section>

          {page.intro?.length > 0 && (
            <section className="rounded-[28px] md:rounded-[40px] bg-surface px-5 py-10 text-cream md:mx-3 md:px-14 md:py-24">
              <div className="max-w-[720px] space-y-5">
                {page.intro.map((t) => (
                  <p key={t.slice(0, 40)} className="leading-relaxed text-cream-muted">
                    {t}
                  </p>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="px-5 pb-14 md:px-14">
        <p className="text-[max(12px,0.85em)] text-muted-foreground">
          Служебная страница для предпросмотра. Не индексируется поисковыми системами.
        </p>
      </div>
    </main>
  );
};

export default CalcPreview;
