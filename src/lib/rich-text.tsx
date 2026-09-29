import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/**
 * Текст со ссылками вида [анкор](/адрес) — в обычные ссылки.
 * Используется в статьях глоссария: разметка лежит прямо в данных.
 */
export const richText = (text: string): ReactNode => {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK.lastIndex = 0;

  while ((m = LINK.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link
        key={`${m.index}-${m[2]}`}
        to={m[2]}
        className="break-words underline decoration-current/35 underline-offset-[3px] transition-colors hover:decoration-current"
      >
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }

  if (last === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>);
};

/** Та же разметка, но в виде простого текста — для description и микроразметки. */
export const plainText = (text: string) =>
  text.replace(LINK, "$1");
