import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import type { GlossaryTerm } from "@/data/glossary";

const TermCard = ({
  term,
  related,
  onPickTerm,
}: {
  term: GlossaryTerm;
  related: GlossaryTerm[];
  onPickTerm: (slug: string) => void;
}) => (
  <article
    id={term.slug}
    className="scroll-mt-24 rounded-[28px] bg-surface p-7 text-cream md:p-8"
  >
    <div className="flex items-start justify-between gap-4">
      <h2 className="font-display text-[1.45em] font-semibold leading-tight tracking-[-0.02em] text-cream">
        <Link to={`/slovar/${term.slug}`} className="transition-colors hover:text-brand">
          {term.term}
        </Link>
      </h2>
      <span className="shrink-0 rounded-lg bg-cream/10 px-2.5 py-1 text-[0.72em] text-cream-muted">
        {term.group}
      </span>
    </div>

    <p className="mt-3 text-[1em] leading-snug text-brand">{term.short}</p>
    <p className="mt-3 leading-relaxed text-cream-muted">{term.full}</p>

    {term.formula && (
      <p className="mt-4 rounded-2xl border border-cream/15 bg-cream/[0.04] px-4 py-3 font-mono text-[0.88em] leading-snug text-cream">
        {term.formula}
      </p>
    )}

    {term.example && (
      <p className="mt-3 text-[0.9em] leading-snug text-cream-muted">
        <span className="text-cream">Пример. </span>
        {term.example}
      </p>
    )}

    {related.length > 0 && (
      <div className="mt-5 border-t border-cream/12 pt-4">
        <span className="text-[0.8em] uppercase tracking-wide text-cream-muted">
          смотрите также
        </span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {related.map((r) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => onPickTerm(r.slug)}
              title={r.short}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cream/[0.08] px-3 py-1.5 text-[0.84em] text-cream transition-colors hover:bg-brand hover:text-foreground"
            >
              {r.term}
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="mt-5">
      <Link
        to={`/slovar/${term.slug}`}
        className="inline-flex items-center gap-2 text-[0.9em] font-medium text-brand hover:underline"
      >
        подробнее о термине
        <Icon name="ArrowRight" size={15} />
      </Link>
    </div>

    {term.links && term.links.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {term.links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream/25 px-3.5 py-2 text-[0.85em] text-cream transition-colors hover:border-brand hover:text-brand"
          >
            {l.label}
            <Icon name="ArrowUpRight" size={14} />
          </Link>
        ))}
      </div>
    )}
  </article>
);

export default TermCard;
