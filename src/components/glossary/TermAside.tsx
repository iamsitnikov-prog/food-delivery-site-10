import { useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MiniCalc from "./MiniCalc";
import type { GlossaryTerm } from "@/data/glossary";
import { getRelated, getSameGroup } from "@/data/glossary";
import { PEOPLE } from "@/data/team";
import { buildToc } from "@/lib/term-anchors";
import { useActiveAnchor } from "@/hooks/use-active-anchor";
import { getCta, getExpertIndex, getExpertNote, getMiniCalc } from "@/data/term-sidebar";

/** Правая колонка страницы термина: оглавление, расчёт, заявка, соседние термины. */
const TermAside = ({ term }: { term: GlossaryTerm }) => {
  const toc = buildToc(term);
  const mini = getMiniCalc(term);
  const cta = getCta(term);
  const expert = PEOPLE[getExpertIndex(term)];
  const note = getExpertNote(term);

  const ids = useMemo(() => toc.map((i) => i.id), [toc]);
  const active = useActiveAnchor(ids);

  // 5–7 ссылок: сначала прямые связи, добиваем соседями по теме.
  const direct = getRelated(term);
  const nearby = getSameGroup(term, 12).filter(
    (g) => !direct.some((d) => d.slug === g.slug),
  );
  const links = [...direct, ...nearby].slice(0, 7);

  return (
    <aside className="mt-8 space-y-4 lg:sticky lg:top-6 lg:mt-0 lg:self-start">
      {toc.length > 1 && (
        <nav
          aria-label="Содержание статьи"
          className="rounded-[24px] bg-pale p-6 text-foreground"
        >
          <h2 className="text-[0.78em] font-medium uppercase tracking-wide text-foreground/50">
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

      {mini && <MiniCalc meta={mini} />}

      <div className="rounded-[24px] bg-surface p-6 text-cream">
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
        <p className="mt-2.5 text-center text-[0.8em] text-cream-muted">
          разбор занимает 20 минут, без обязательств
        </p>
      </div>

      {links.length > 0 && (
        <nav
          aria-label="Связанные термины"
          className="rounded-[24px] bg-pale p-6 text-foreground"
        >
          <h2 className="text-[0.78em] font-medium uppercase tracking-wide text-foreground/50">
            связанные термины
          </h2>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.slug}
                to={`/slovar/${l.slug}`}
                title={l.short}
                className="rounded-xl border border-foreground/15 bg-cream/70 px-3.5 py-2 text-[0.88em] leading-none transition-colors hover:border-foreground/40 hover:bg-cream"
              >
                {l.term}
              </Link>
            ))}
          </div>
          <Link
            to="/slovar"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.88em] font-medium transition-opacity hover:opacity-70"
          >
            весь глоссарий
            <Icon name="ArrowRight" size={15} />
          </Link>
        </nav>
      )}

      <div className="rounded-[24px] bg-cream p-6 text-foreground">
        <div className="flex items-center gap-3">
          <img
            src={expert.photo}
            alt={expert.name}
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium leading-tight">{expert.name}</p>
            <p className="mt-0.5 text-[0.82em] leading-snug text-foreground/55">
              {expert.exp}
            </p>
          </div>
        </div>
        <p className="mt-3.5 text-[0.92em] leading-relaxed text-foreground/75">«{note}»</p>
      </div>

      <div className="rounded-[24px] bg-cream p-6 text-foreground">
        <h2 className="text-[0.78em] font-medium uppercase tracking-wide text-foreground/50">
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
