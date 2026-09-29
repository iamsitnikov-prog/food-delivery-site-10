import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { GLOSSARY } from "@/data/glossary";

const TermsStrip = ({
  slugs,
  title = "термины из этого материала",
}: {
  slugs: string[];
  title?: string;
}) => {
  const terms = slugs
    .map((s) => GLOSSARY.find((t) => t.slug === s))
    .filter((t): t is (typeof GLOSSARY)[number] => Boolean(t));

  if (!terms.length) return null;

  return (
    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <div className="rounded-[28px] bg-surface p-4 text-cream md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 font-display text-[1.3em] font-semibold tracking-[-0.02em]">
            <Icon name="BookA" size={22} className="text-brand" />
            {title}
          </h2>
          <Link
            to="/slovar"
            className="inline-flex items-center gap-1.5 text-[0.9em] text-brand hover:underline"
          >
            весь глоссарий
            <Icon name="ArrowRight" size={15} />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {terms.map((t) => (
            <Link
              key={t.slug}
              to={`/slovar/${t.slug}`}
              className="group rounded-2xl bg-cream/[0.06] p-4 transition-colors hover:bg-cream/[0.1]"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-medium text-cream">{t.term}</span>
                <Icon
                  name="ArrowUpRight"
                  size={15}
                  className="shrink-0 text-cream-muted transition-colors group-hover:text-brand"
                />
              </span>
              <span className="mt-1.5 block text-[0.88em] leading-snug text-cream-muted">
                {t.short}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsStrip;
