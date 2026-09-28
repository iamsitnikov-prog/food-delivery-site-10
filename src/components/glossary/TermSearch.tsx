import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { GLOSSARY, type GlossaryTerm } from "@/data/glossary";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").trim();

/** Раскладка: «ыкм» → «drr», чтобы термин находился без переключения языка. */
const RU = "йцукенгшщзхъфывапролджэячсмитьбю";
const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.";
const fromLayout = (s: string) =>
  s
    .split("")
    .map((ch) => {
      const i = RU.indexOf(ch);
      if (i >= 0) return EN[i];
      const j = EN.indexOf(ch);
      return j >= 0 ? RU[j] : ch;
    })
    .join("");

const score = (term: GlossaryTerm, q: string) => {
  const name = norm(term.term);
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  const words = name.split(/[\s/(-]+/);
  if (words.some((w) => w.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  if (norm(term.short).includes(q)) return 4;
  if (norm(term.full).includes(q)) return 5;
  return -1;
};

export const suggest = (raw: string, limit = 8) => {
  const q = norm(raw);
  if (q.length < 2) return [];
  const alt = norm(fromLayout(q));

  const hits: { term: GlossaryTerm; rank: number }[] = [];
  for (const t of GLOSSARY) {
    let rank = score(t, q);
    if (rank < 0 && alt !== q) {
      const r = score(t, alt);
      if (r >= 0) rank = r + 0.5;
    }
    if (rank >= 0) hits.push({ term: t, rank });
  }

  return hits
    .sort((a, b) => a.rank - b.rank || a.term.term.localeCompare(b.term.term, "ru"))
    .slice(0, limit)
    .map((h) => h.term);
};

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const q = norm(query);
  const idx = norm(text).indexOf(q);
  if (q.length < 2 || idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand/30 text-inherit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const TermSearch = ({
  value,
  onChange,
  placeholder = "Найти термин: ДРР, GMV, фудкост…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => suggest(value), [value]);

  useEffect(() => setActive(0), [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const go = (term: GlossaryTerm) => {
    setOpen(false);
    navigate(`/slovar/${term.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && items.length > 0;

  return (
    <div ref={boxRef} className="relative max-w-[460px]">
      <label className="relative block">
        <Icon
          name="Search"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls="term-suggest"
          aria-autocomplete="list"
          className="w-full rounded-xl border border-foreground/15 bg-background py-3.5 pl-11 pr-10 text-[0.97em] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            aria-label="Очистить поиск"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="X" size={15} />
          </button>
        )}
      </label>

      {showList && (
        <ul
          id="term-suggest"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[360px] overflow-y-auto rounded-2xl border border-foreground/12 bg-surface p-1.5 shadow-2xl"
        >
          {items.map((t, i) => (
            <li key={t.slug} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t)}
                className={`flex w-full items-start gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                  i === active ? "bg-cream/[0.12]" : "hover:bg-cream/[0.08]"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-cream">
                    <Highlight text={t.term} query={value} />
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[0.85em] leading-snug text-cream-muted">
                    {t.short}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-cream/10 px-2 py-1 text-[0.7em] text-cream-muted">
                  {t.group}
                </span>
              </button>
            </li>
          ))}
          <li className="border-t border-cream/10 px-3.5 py-2 text-[0.78em] text-cream-muted">
            ↑↓ — выбрать, Enter — открыть термин
          </li>
        </ul>
      )}
    </div>
  );
};

export default TermSearch;
