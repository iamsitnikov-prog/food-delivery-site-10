import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MiniCalc from "./MiniCalc";
import type { GlossaryTerm } from "@/data/glossary";
import { getRelated, getSameGroup } from "@/data/glossary";
import { PEOPLE } from "@/data/team";
import { buildToc } from "@/lib/term-anchors";
import { getCta, getExpertIndex, getExpertNote, getMiniCalc } from "@/data/term-sidebar";

/** Правая колонка страницы термина: оглавление, расчёт, заявка, соседние термины. */
const TermAside = ({ term }: { term: GlossaryTerm }) => {
  const toc = buildToc(term);
  const mini = getMiniCalc(term);
  const cta = getCta(term);
  const expert = PEOPLE[getExpertIndex(term)];
  const note = getExpertNote(term);

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
          className="rounded-[24px] border border-foreground/12 p-6"
        >
          <h2 className="flex items-center gap-2 font-display text-[1.1em] font-semibold tracking-[-0.02em]">
            <Icon name="List" size={17} />
            содержание
          </h2>
          <ul className="mt-3.5 space-y-2">
            {toc.map((i) => (
              <li key={i.id} className={i.level === 3 ? "pl-3.5" : ""}>
                <a
                  href={`#${i.id}`}
                  className="text-[0.92em] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                >
                  {i.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {mini && <MiniCalc meta={mini} />}

      <div className="rounded-[24px] bg-brand p-6 text-foreground">
        <h2 className="font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">
          {cta.title}
        </h2>
        <p className="mt-2.5 text-[0.92em] leading-snug text-foreground/75">{cta.text}</p>
        <a
          href="#lead"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-[0.92em] font-medium text-brand transition-transform hover:-translate-y-0.5"
        >
          бесплатный анализ
          <Icon name="ArrowRight" size={16} />
        </a>
        <p className="mt-2.5 text-[0.8em] text-foreground/60">
          разбор занимает 20 минут, без обязательств
        </p>
      </div>

      {links.length > 0 && (
        <nav
          aria-label="Связанные термины"
          className="rounded-[24px] border border-foreground/12 p-6"
        >
          <h2 className="flex items-center gap-2 font-display text-[1.1em] font-semibold tracking-[-0.02em]">
            <Icon name="Network" size={17} />
            связанные термины
          </h2>
          <ul className="mt-3.5 space-y-2.5">
            {links.map((l) => (
              <li key={l.slug}>
                <Link
                  to={`/slovar/${l.slug}`}
                  className="group flex items-start justify-between gap-2 text-[0.92em] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.term}
                  <Icon
                    name="ArrowUpRight"
                    size={15}
                    className="mt-0.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/slovar"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.88em] font-medium transition-opacity hover:opacity-70"
          >
            весь глоссарий
            <Icon name="ArrowRight" size={15} />
          </Link>
        </nav>
      )}

      <div className="rounded-[24px] bg-surface p-6 text-cream">
        <h2 className="text-[0.8em] uppercase tracking-wide text-cream-muted">
          комментарий эксперта
        </h2>
        <div className="mt-3.5 flex items-center gap-3">
          <img
            src={expert.photo}
            alt={expert.name}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium leading-tight">{expert.name}</p>
            <p className="mt-0.5 text-[0.82em] leading-snug text-cream-muted">{expert.exp}</p>
          </div>
        </div>
        <p className="mt-3.5 text-[0.92em] leading-relaxed text-cream-muted">«{note}»</p>
      </div>

      <div className="rounded-[24px] border border-foreground/12 p-6">
        <h2 className="flex items-center gap-2 font-display text-[1.1em] font-semibold tracking-[-0.02em]">
          <Icon name="Compass" size={17} />
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
                className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
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
