import type { TermSection } from "@/data/term-index";
import { anchorId } from "@/lib/term-anchors";
import { richText } from "@/lib/rich-text";

/** Раздел статьи термина: абзацы, таблица и список в утверждённом порядке. */
const TermSectionBlock = ({ section: s }: { section: TermSection }) => {
  const paragraphs = s.paragraphs ?? (s.body ? [s.body] : []);

  return (
    <div className="mt-7 border-t border-cream/12 pt-6">
      <h3
        id={anchorId(s.title)}
        className={`scroll-mt-6 font-display font-semibold tracking-[-0.02em] text-cream ${
          s.level2 ? "text-[1.3em]" : "text-[1.15em]"
        }`}
      >
        {s.title}
      </h3>

      {paragraphs.map((p, i) => (
        <p key={i} className="mt-3 text-[1.02em] leading-relaxed text-cream-muted">
          {richText(p)}
        </p>
      ))}

      {s.table && s.table.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-[0.95em]">
            <thead>
              <tr>
                {s.table[0].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="border-b border-cream/20 py-2.5 pr-4 align-bottom text-[0.92em] font-medium uppercase tracking-wide text-cream-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.slice(1).map((row, r) => (
                <tr key={r}>
                  {row.map((c, i) => (
                    <td
                      key={i}
                      className={`border-b border-cream/10 py-2.5 pr-4 align-top leading-snug ${
                        i === 0 ? "font-medium text-cream" : "text-cream-muted"
                      }`}
                    >
                      {richText(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {s.list && s.list.length > 0 && (
        <ul className="mt-4 space-y-2">
          {s.list.map((li, i) => (
            <li
              key={i}
              className="relative pl-5 text-[1.02em] leading-relaxed text-cream-muted before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand"
            >
              {richText(li)}
            </li>
          ))}
        </ul>
      )}

      {s.after?.map((p, i) => (
        <p key={i} className="mt-3 text-[1.02em] leading-relaxed text-cream-muted">
          {richText(p)}
        </p>
      ))}
    </div>
  );
};

export default TermSectionBlock;
