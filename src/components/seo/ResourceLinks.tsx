import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getServiceResources } from "@/data/service-resources";

type Props = { slug: string; kind: "service" | "city" };

const ResourceLinks = ({ slug, kind }: Props) => {
  const items = getServiceResources(slug, kind);
  if (!items.length) return null;

  return (
    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
        полезное по теме
      </h2>
      <p className="mt-3 max-w-[520px] text-[0.95em] leading-snug text-muted-foreground">
        Бесплатные материалы, которые помогут разобраться самостоятельно.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="group rounded-[24px] border border-foreground/12 p-6 transition-colors hover:border-foreground/40"
          >
            <Icon name={r.icon} size={22} className="text-foreground/60" />
            <h3 className="mt-3 font-display text-[1.1em] font-semibold leading-tight">
              {r.label}
            </h3>
            <p className="mt-2 text-[0.9em] leading-snug text-muted-foreground">{r.note}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.85em] text-foreground/70 transition-colors group-hover:text-foreground">
              открыть
              <Icon name="ArrowUpRight" size={15} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ResourceLinks;
