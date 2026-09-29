import { HOME_CASES as CASES } from "@/data/home";
import { HOME_STATS as STATS } from "@/data/home";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";
import CountUp from "./CountUp";

const HERO_STAT = { v: "2,6", unit: "млрд ₽", l: "выручка проектов, которые ведём" };



const NUM = /([+×]?\d[\d\u00A0 ]*(?:[.,]\d+)?(?:\s?[₽%])?)/g;

const highlight = (text: string, light: boolean) =>
  text.split(NUM).map((part, i) => {
    if (!/^[+×]?\d/.test(part)) return <span key={i}>{part}</span>;
    const trimmed = part.trimEnd();
    return (
      <span key={i}>
        <b className={`font-semibold ${light ? "text-foreground" : "text-brand"}`}>{trimmed}</b>
        {part.slice(trimmed.length)}
      </span>
    );
  });

const Results = () => {
  const ref = useReveal<HTMLElement>();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? CASES : CASES.slice(0, 6);

  return (
    <section id="results" ref={ref} className="relative mt-5 scroll-mt-4 overflow-hidden rounded-[28px] md:rounded-[40px] bg-surface px-5 py-10 text-cream md:mx-3 md:mt-7 md:px-14 md:py-28">
      <img
        src="/robot-flip-500.webp?v=2"
        srcSet="/robot-flip-500.webp?v=2 500w, /robot-flip.webp?v=2 800w"
        sizes="(max-width: 768px) 320px, 800px"
        alt=""
        aria-hidden
        width={800}
        height={765}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -right-10 -top-12 hidden w-[140px] animate-float opacity-90 sm:block lg:right-auto lg:-left-16 lg:-top-10 lg:w-[420px]"
      />
      <div className="relative">
        <div className="reveal mb-6 md:mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:pl-[34%]">
          <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[52px] lg:text-[72px]">
            результаты
            <span className="block pl-[1.2em] text-brand">в&nbsp;цифрах</span>
          </h2>
          <p className="max-w-[340px] text-[1.05em] leading-snug text-cream-muted lg:max-w-[340px]">
            Настраиваем работу таким образом, чтобы гарантировать реальные результаты для&nbsp;вашего бизнеса.
          </p>
        </div>

        <div className="reveal flex flex-col items-center gap-3 border-y border-cream/25 py-10 text-center md:py-14">
          <span className="flex items-baseline gap-3 font-display font-semibold leading-[.85] tracking-[-0.045em] text-brand">
            <CountUp value={HERO_STAT.v} className="text-[28px] md:text-[130px]" />
            <span className="text-[23px] md:text-[44px]">{HERO_STAT.unit}</span>
          </span>
          <p className="max-w-[420px] text-[1em] leading-snug text-cream-muted md:text-[1.15em]">{HERO_STAT.l}</p>
        </div>

        <div className="reveal mt-8 md:mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.l}
              className="group flex flex-col items-center border-t border-cream/25 pt-4 text-center transition-colors hover:border-brand"
            >
              <CountUp
                value={s.v}
                className="block font-display text-[24px] font-semibold leading-none tracking-[-0.04em] text-brand transition-transform duration-500 group-hover:-translate-y-1 md:text-[64px]"
              />
              <p className="mt-3 max-w-[260px] text-[0.92em] leading-snug text-cream-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c, i) => {
            const light = i % 2 === 1;
            return (
              <article
                key={c.name}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`group animate-fade-in rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1.5 ${
                  light ? "bg-pale text-foreground" : "border border-cream/20"
                }`}
              >
                <div
                  className={`flex items-center justify-between text-[max(12px,0.82em)] font-semibold ${
                    light ? "text-foreground" : "text-brand"
                  }`}
                >
                  <span>{c.tag}</span>
                  <span className={light ? "text-foreground/60" : "text-cream-muted"}>{c.city}</span>
                </div>
                <h3 className="mt-2 font-display text-[1.4em] font-semibold tracking-[-0.02em]">{c.name}</h3>
                <div className="mt-6 text-[0.92em]">
                  <span
                    className={`line-through ${
                      light ? "text-foreground/60 decoration-foreground/40" : "text-cream-muted decoration-cream/40"
                    }`}
                  >
                    {c.before}
                  </span>
                </div>
                <span
                  className={`mt-1 block font-display text-[1.5em] font-semibold ${light ? "text-foreground" : "text-cream"}`}
                >
                  {c.after}
                </span>
                <p
                  className={`mt-5 border-t pt-4 text-[max(12px,0.88em)] leading-snug ${
                    light ? "border-foreground/20 text-foreground/80" : "border-cream/20 text-cream-muted"
                  }`}
                >
                  {highlight(c.what, light)}
                </p>
              </article>
            );
          })}
        </div>

        {CASES.length > 6 && (
          <div className="reveal mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-7 py-4 font-medium transition-colors hover:bg-brand hover:text-foreground"
            >
              {showAll ? "свернуть кейсы" : `показать ещё ${CASES.length - 6}`}
              <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;