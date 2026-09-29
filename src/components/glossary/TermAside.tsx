import { useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MiniCalc from "./MiniCalc";
import type { GlossaryTerm } from "@/data/term-index";
import { getBrief } from "@/data/term-index";
import { PEOPLE } from "@/data/team";
import { buildToc } from "@/lib/term-anchors";
import { useActiveAnchor } from "@/hooks/use-active-anchor";
import { getCta, getMiniCalc } from "@/data/term-sidebar";

/** Правая колонка страницы термина: оглавление, расчёт, заявка, соседние термины. */
const TermAside = ({ term }: { term: GlossaryTerm }) => {
  const toc = buildToc(term);
  // Адрес калькулятора задан в данных термина и важнее подбора по теме.
  const base = term.calculator ? getMiniCalc(term) : null;
  const mini =
    base && term.calculator ? { ...base, to: term.calculator } : base;
  const cta = getCta(term);
  // Комментарий свой у каждого термина; подпись со стажем берём из команды.
  const expert = term.expert;
  const person = expert
    ? PEOPLE.find((p) => p.name === expert.name)
    : undefined;

  const ids = useMemo(() => toc.map((i) => i.id), [toc]);
  const active = useActiveAnchor(ids);

  // Связанные термины заданы в данных — порядок утверждён и не меняется.
  const links = (term.related ?? [])
    .map((href) => getBrief(href.replace("/slovar/", "")))
    .filter((t): t is GlossaryTerm => Boolean(t));

  return (
    <aside className="mt-8 space-y-4 lg:sticky lg:top-6 lg:mt-0 lg:self-start">
      {toc.length > 1 && (
        <nav
          aria-label="Содержание статьи"
          className="rounded-[24px] bg-pale p-4 md:p-6 text-foreground"
        >
          <h2 className="text-[max(12px,0.78em)] font-medium uppercase tracking-wide text-foreground/50">
            содержание
          </h2>
          <ul className="mt-3.5 space-y-1">
            {toc.map((i) => {
              const on = active === i.id;
              return (
                <li key={i.id}>
                  <a
                    href={`#${i.id}`}
                    aria-current={on ? "true" : undefined}
                    className={`flex gap-2.5 rounded-lg py-1.5 text-[0.92em] leading-snug transition-colors ${
                      i.level === 3 ? "pl-3.5" : ""
                    } ${on ? "font-medium text-foreground" : "text-foreground/60 hover:text-foreground"}`}
                  >
                    <span
                      aria-hidden
                      className={`mt-[3px] w-[3px] shrink-0 rounded-full transition-colors ${
                        on ? "bg-foreground" : "bg-transparent"
                      }`}
                    />
                    {i.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {mini ? (
        <MiniCalc meta={mini} />
      ) : (
        term.calculator && (
          <Link
            to={term.calculator}
            className="flex items-center justify-between gap-3 rounded-[24px] bg-cream p-4 md:p-6 text-foreground transition-transform hover:-translate-y-0.5"
          >
            <span>
              <span className="block font-display text-[1.1em] font-semibold tracking-[-0.02em]">
                {term.calculator === "/testy/dokumenty"
                  ? "Пройти тест по документам"
                  : "проверить себя"}
              </span>
              <span className="mt-1 block text-[max(12px,0.88em)] leading-snug text-foreground/60">
                короткий тест по теме
              </span>
            </span>
            <Icon name="ArrowRight" size={18} className="shrink-0" />
          </Link>
        )
      )}

      <div className="rounded-[24px] bg-surface p-4 md:p-6 text-cream">
        <h2 className="font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">
          {cta.title}
        </h2>
        <p className="mt-2.5 text-[0.92em] leading-snug text-cream-muted">{cta.text}</p>
        <a
          href="#lead"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[0.92em] font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          получить бесплатный анализ
        </a>
        <p className="mt-2.5 text-center text-[max(12px,0.8em)] text-cream-muted">
          разбор занимает 20 минут, без обязательств
        </p>
        {term.service && (
          <Link
            to={term.service}
            className="mt-3.5 flex items-center justify-center gap-1.5 text-[max(12px,0.88em)] font-medium text-brand transition-opacity hover:opacity-80"
          >
            подробнее об услуге
            <Icon name="ArrowRight" size={15} />
          </Link>
        )}
      </div>

      {links.length > 0 && (
        <nav
          aria-label="Связанные термины"
          className="rounded-[24px] bg-pale p-4 md:p-6 text-foreground"
        >
          <h2 className="text-[max(12px,0.78em)] font-medium uppercase tracking-wide text-foreground/50">
            связанные термины
          </h2>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.slug}
                to={`/slovar/${l.slug}`}
                title={l.short}
                className="rounded-xl border border-foreground/15 bg-cream/70 px-3.5 py-2 text-[max(12px,0.88em)] leading-none transition-colors hover:border-foreground/40 hover:bg-cream"
              >
                {l.term}
              </Link>
            ))}
          </div>
          <Link
            to="/slovar"
            className="mt-4 inline-flex items-center gap-1.5 text-[max(12px,0.88em)] font-medium transition-opacity hover:opacity-70"
          >
            весь глоссарий
            <Icon name="ArrowRight" size={15} />
          </Link>
        </nav>
      )}

      {expert && (
        <div className="rounded-[24px] bg-cream p-4 md:p-6 text-foreground">
          <div className="flex items-center gap-3">
            {person && (
              <img
                src={person.photo}
                alt={expert.name}
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="font-medium leading-tight">{expert.name}</p>
              {person && (
                <p className="mt-0.5 text-[max(12px,0.82em)] leading-snug text-foreground/55">
                  {person.exp}
                </p>
              )}
            </div>
          </div>
          <p className="mt-3.5 text-[0.92em] leading-relaxed text-foreground/75">
            «{expert.text}»
          </p>
        </div>
      )}

      <div className="rounded-[24px] bg-cream p-4 md:p-6 text-foreground">
        <h2 className="text-[max(12px,0.78em)] font-medium uppercase tracking-wide text-foreground/50">
          что дальше
        </h2>
        <ul className="mt-3.5 space-y-2.5 text-[0.92em]">
          {[
            { to: "/kalkulyatory", label: "калькуляторы для доставки", icon: "Calculator" },
            { to: "/chek-listy", label: "чек-листы по запуску", icon: "ListChecks" },
            { to: "/razbor-otchetov", label: "разбор отчётов агрегатора", icon: "FileText" },
            { to: "/blog", label: "блог о доставке", icon: "Newspaper" },
          ].map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="flex items-center gap-2.5 text-foreground/70 transition-colors hover:text-foreground"
              >
                <Icon name={l.icon} size={16} className="shrink-0" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default TermAside;