import type { PostBlock } from "@/data/blog-posts";
import Icon from "@/components/ui/icon";

const PostBody = ({ blocks }: { blocks: PostBlock[] }) => (
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
            {b.text}
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

      if (b.type === "list")
        return (
          <ul key={i} className="mt-6 space-y-3">
            {b.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-foreground/85">
                <Icon name="Check" size={19} className="mt-1 shrink-0" />
                {item}
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
                <span className="pt-0.5">{item}</span>
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

export default PostBody;