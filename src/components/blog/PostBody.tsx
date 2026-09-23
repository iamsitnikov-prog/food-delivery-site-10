import { Link } from "react-router-dom";
import type { PostBlock } from "@/data/blog-posts";
import Icon from "@/components/ui/icon";
import { INTERLINKS } from "@/data/interlinks";

const linkify = (text: string, currentSlug: string, used: Set<string>) => {
  const targets = INTERLINKS.filter((l) => l.slug !== currentSlug && !used.has(l.slug));
  if (!targets.length) return text;

  let best: { idx: number; slug: string; phrase: string } | null = null;
  for (const t of targets) {
    const idx = text.toLowerCase().indexOf(t.phrase.toLowerCase());
    if (idx === -1) continue;
    if (!best || idx < best.idx) best = { idx, slug: t.slug, phrase: t.phrase };
  }
  if (!best) return text;

  const end = best.idx + best.phrase.length;
  const tail = text.slice(end).match(/^[а-яё]*/i)?.[0] ?? "";
  used.add(best.slug);

  return [
    text.slice(0, best.idx),
    <Link
      key={best.slug}
      to={`/blog/${best.slug}`}
      className="underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
    >
      {text.slice(best.idx, end) + tail}
    </Link>,
    linkify(text.slice(end + tail.length), currentSlug, used),
  ];
};

const PostBody = ({ blocks, slug = "" }: { blocks: PostBlock[]; slug?: string }) => {
  const used = new Set<string>();

  return (
  <div className="min-w-0 text-[1.06em]">
    {blocks.map((b, i) => {
      if (b.type === "h2")
        return (
          <h2
            key={i}
            id={b.id}
            className="mt-14 scroll-mt-8 font-display text-[1.8em] font-semibold leading-tight tracking-[-0.03em] md:text-[2.3em]"
          >
            {b.text}
          </h2>
        );

      if (b.type === "h3")
        return (
          <h3 key={i} className="mt-9 font-display text-[1.25em] font-semibold tracking-[-0.02em] md:text-[1.45em]">
            {b.text}
          </h3>
        );

      if (b.type === "p")
        return (
          <p key={i} className="mt-5 leading-relaxed text-foreground/85">
            {linkify(b.text, slug, used)}
          </p>
        );

      if (b.type === "quote")
        return (
          <blockquote
            key={i}
            className="mt-8 rounded-[24px] bg-surface p-7 font-display text-[1.15em] font-medium leading-snug text-cream md:text-[1.3em]"
          >
            {b.text}
          </blockquote>
        );

      if (b.type === "partner")
        return (
          <aside key={i} className="mt-8 rounded-[24px] border border-primary/25 bg-pale p-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-foreground px-3 py-1.5 text-[0.75em] font-medium uppercase tracking-wide text-brand">
                новое
              </span>
              <span className="text-[0.85em] text-foreground/60">инструмент, который мы советуем</span>
            </div>
            <p className="mt-4 leading-relaxed text-foreground/85">{b.text}</p>
            {b.promo && (
              <div className="mt-4 mr-3 inline-flex items-center gap-3 rounded-xl bg-foreground px-4 py-3 align-middle">
                <span className="text-[0.78em] uppercase tracking-wide text-brand/70">промокод</span>
                <span className="font-display text-[1.1em] font-semibold text-brand">{b.promo}</span>
              </div>
            )}
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[0.95em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {b.cta || `перейти в ${b.name}`}
              <Icon name="ArrowUpRight" size={17} />
            </a>
          </aside>
        );

      if (b.type === "list")
        return (
          <ul key={i} className="mt-6 space-y-3">
            {b.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-foreground/85">
                <Icon name="Check" size={19} className="mt-1 shrink-0" />
                {linkify(item, slug, used)}
              </li>
            ))}
          </ul>
        );

      if (b.type === "numbered")
        return (
          <ol key={i} className="mt-6 space-y-4">
            {b.items.map((item, n) => (
              <li key={item} className="flex gap-4 leading-relaxed text-foreground/85">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-[0.85em] font-semibold text-brand">
                  {n + 1}
                </span>
                <span className="pt-0.5">{linkify(item, slug, used)}</span>
              </li>
            ))}
          </ol>
        );

      return (
        <div key={i} className="mt-8 overflow-x-auto rounded-[24px] border border-primary/25">
          <table className="w-full min-w-[520px] border-collapse text-left text-[0.95em]">
            <thead>
              <tr className="bg-surface text-cream">
                {b.head.map((h) => (
                  <th key={h} className="px-5 py-4 font-display font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-t border-primary/20">
                  {row.map((cell, c) => (
                    <td key={c} className={`px-5 py-4 align-top leading-snug ${c === 0 ? "font-medium" : "text-foreground/80"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })}
  </div>
  );
};

export default PostBody;