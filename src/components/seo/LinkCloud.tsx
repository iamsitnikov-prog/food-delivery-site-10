import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Item = { slug: string; navLabel: string };

const LinkCloud = ({
  items,
  base,
  initial = 6,
}: {
  items: Item[];
  base: string;
  initial?: number;
}) => {
  const [open, setOpen] = useState(false);
  const hidden = items.length - initial;

  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((o, i) => (
          <li key={o.slug} className={!open && i >= initial ? "hidden sm:block" : undefined}>
            <Link
              to={`${base}/${o.slug}`}
              className="inline-flex rounded-xl border border-primary/30 px-4 py-2.5 text-[0.92em] transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {o.navLabel}
            </Link>
          </li>
        ))}
      </ul>

      {hidden > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-[max(12px,0.9em)] font-medium text-foreground/70 transition-colors hover:text-foreground sm:hidden"
        >
          показать ещё {hidden}
          <Icon name="ChevronDown" size={15} />
        </button>
      )}
    </>
  );
};

export default LinkCloud;
