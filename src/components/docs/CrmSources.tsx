import { Fragment, useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

// Откуда приходят заявки (с 23.11.2026): какие страницы, поисковики и запросы
// приводят заявки и клиентов. Данные о заходе сайт кладёт в заявку сам
// (src/lib/attribution.ts → api/lead.php), запросы и визиты по страницам раз в день
// приходят из Вебмастера и Метрики (agregatory-deploy: scripts/lead-queries.py).

export type Touch = {
  at?: string;
  landing?: string;
  ref?: string;
  utm?: Record<string, string>;
  kind?: string;
  engine?: string;
  query?: string;
};
export type Src = Touch & { form?: string; pages?: string[]; cid?: string; first?: Touch; manual?: string };

type LeadLike = {
  id: number;
  created: string;
  name: string;
  status: string;
  amount: number;
  page: string;
  source: string;
  src?: Src | null;
};
type Status = { id: string; title: string };
type QRow = [string, number, number, number | null]; // запрос, клики, показы, средняя позиция
type SeoPage = { q: QRow[]; v: { total?: number; search?: number; yandex?: number; google?: number; ai?: number } };
export type Seo = { updated: string; wm?: { from?: string; to?: string }; mk?: { from?: string; to?: string }; pages: Record<string, SeoPage> };

const pathOf = (u: string) => {
  try {
    const p = new URL(u, "https://agregatory.pro").pathname.replace(/\/+$/, "");
    return p || "/";
  } catch {
    return "";
  }
};

// «Поиск: Яндекс», «ИИ: ChatGPT», «Прямой заход»
export const touchLabel = (t?: Touch | null) => {
  if (!t || !t.kind) return "неизвестно";
  const e = t.engine || "";
  switch (t.kind) {
    case "поиск":
      return `Поиск: ${e}`;
    case "ИИ":
      return `ИИ: ${e}`;
    case "соцсети":
      return `Соцсети: ${e}`;
    case "реклама":
      return `Реклама: ${e}`;
    case "сайт":
      return `Ссылка: ${e}`;
    case "метка":
      return `Метка: ${e}`;
    case "вручную":
      return `Указали: ${e}`;
    default:
      return t.kind.charAt(0).toUpperCase() + t.kind.slice(1);
  }
};
// Коротко для карточки на доске
export const touchShort = (s?: Src | null) => {
  if (!s || !s.kind) return "";
  const t = s.first && s.kind === "прямой заход" ? s.first : s;
  if (t.kind === "поиск" || t.kind === "ИИ" || t.kind === "соцсети" || t.kind === "реклама" || t.kind === "вручную") return t.engine || t.kind || "";
  if (t.kind === "сайт") return t.engine || "";
  return t.kind === "прямой заход" ? "прямой" : t.kind || "";
};

const KIND_ICON: Record<string, string> = {
  поиск: "Search",
  ИИ: "Sparkles",
  соцсети: "Users",
  реклама: "Megaphone",
  сайт: "Link",
  метка: "Tag",
  вручную: "PenLine",
  "прямой заход": "MousePointerClick",
  "Яндекс Карты": "MapPin",
};
export const SrcChip = ({ s }: { s?: Src | null }) => {
  const label = touchShort(s);
  if (!label) return null;
  const t = s?.first && s.kind === "прямой заход" ? s.first : s;
  return (
    <span className="inline-flex max-w-[140px] items-center gap-1 truncate rounded-full bg-cream/[0.07] px-2 py-0.5" title={touchLabel(t)}>
      <Icon name={KIND_ICON[t?.kind || ""] || "Compass"} size={11} />
      <span className="truncate">{label}</span>
    </span>
  );
};

const dateRu = (iso?: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
};
const PageLink = ({ p }: { p: string }) => (
  <a className="break-all underline decoration-cream/30 underline-offset-2" href={p} target="_blank" rel="noreferrer">
    {p}
  </a>
);
const utmText = (u?: Record<string, string>) =>
  Object.entries(u || {})
    .filter(([k]) => k !== "ysclid")
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");

// --- Блок «откуда пришла» в карточке заявки -----------------------------------
export const SourceBlock = ({
  l,
  seo,
  origins,
  onOrigin,
}: {
  l: LeadLike;
  seo: Seo | null;
  origins: string[];
  onOrigin: (o: string) => void;
}) => {
  const s = l.src;
  const auto = s && !s.manual;
  const formPath = s?.form || (l.page.startsWith("http") ? pathOf(l.page) : "");
  const searchTouch = s?.kind === "поиск" ? s : s?.first?.kind === "поиск" ? s.first : null;
  const queries = searchTouch?.landing ? seo?.pages[searchTouch.landing]?.q.slice(0, 5) || [] : [];
  return (
    <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
      <h3 className="font-medium">откуда пришла</h3>
      {auto ? (
        <dl className="mt-3 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[0.95em]">
          <dt className="text-cream-muted">канал</dt>
          <dd>{touchLabel(s)}</dd>
          {s.landing && (
            <>
              <dt className="text-cream-muted">вход</dt>
              <dd>
                <PageLink p={s.landing} />
              </dd>
            </>
          )}
          {formPath && formPath !== s.landing && (
            <>
              <dt className="text-cream-muted">форма</dt>
              <dd>
                <PageLink p={formPath} />
              </dd>
            </>
          )}
          {s.query && (
            <>
              <dt className="text-cream-muted">запрос</dt>
              <dd>«{s.query}»</dd>
            </>
          )}
          {s.ref && s.kind !== "поиск" && (
            <>
              <dt className="text-cream-muted">ссылка</dt>
              <dd className="break-all">{s.ref}</dd>
            </>
          )}
          {utmText(s.utm) && (
            <>
              <dt className="text-cream-muted">метки</dt>
              <dd className="break-all">{utmText(s.utm)}</dd>
            </>
          )}
          {s.first && (
            <>
              <dt className="text-cream-muted">впервые</dt>
              <dd>
                {dateRu(s.first.at)}, {touchLabel(s.first)}
                {s.first.landing && (
                  <>
                    {" → "}
                    <PageLink p={s.first.landing} />
                  </>
                )}
              </dd>
            </>
          )}
          {s.pages && s.pages.length > 1 && (
            <>
              <dt className="text-cream-muted">смотрел</dt>
              <dd className="break-all text-[0.95em]">{s.pages.join(" → ")}</dd>
            </>
          )}
          {s.cid && (
            <>
              <dt className="text-cream-muted">Метрика</dt>
              <dd className="break-all text-cream-muted">ClientID {s.cid}</dd>
            </>
          )}
        </dl>
      ) : (
        <>
          {formPath && (
            <p className="mt-2 text-[0.95em]">
              Форма отправлена на <PageLink p={formPath} />. Откуда человек пришёл на сайт, неизвестно: заявка старше 23.11 или пришла не через форму.
            </p>
          )}
          <label className="mt-3 block text-[0.9em] text-cream-muted" htmlFor={`origin-${l.id}`}>
            если знаете, откуда клиент, отметьте
          </label>
          <select
            id={`origin-${l.id}`}
            value={s?.manual || ""}
            onChange={(e) => onOrigin(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-cream/20 bg-background px-3 text-cream"
          >
            <option value="">не знаем</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </>
      )}
      {queries.length > 0 && (
        <div className="mt-4">
          <div className="text-[0.9em] text-cream-muted">поисковики не передают запрос, но на эту страницу приходят по запросам (Вебмастер):</div>
          <ul className="mt-1.5 space-y-1 text-[0.92em]">
            {queries.map((q) => (
              <li key={q[0]}>
                «{q[0]}» <span className="text-cream-muted">· {q[1]} кл. · поз. {q[3] ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

// --- Отчёт «Откуда заявки» ------------------------------------------------------
type Row = { key: string; leads: LeadLike[]; checklists: number; work: number; clients: number; sum: number };

const PERIODS = [
  { id: 30, title: "30 дней" },
  { id: 90, title: "90 дней" },
  { id: 365, title: "год" },
  { id: 0, title: "всё время" },
];

export const SourcesReport = ({
  items,
  statuses,
  seo,
  seoErr,
  onOpenLead,
  onClose,
}: {
  items: LeadLike[];
  statuses: Status[];
  seo: Seo | null;
  seoErr: string;
  onOpenLead: (id: number) => void;
  onClose: () => void;
}) => {
  const [days, setDays] = useState(90);
  const [mode, setMode] = useState<"first" | "last">("first");
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  // Клиент: дошёл до «Договор» или дальше по доске (кроме «Нет ответа» и «Отказ»), или оплатил
  const contractAt = statuses.findIndex((s) => s.id === "contract");
  const isClient = (l: LeadLike) =>
    l.amount > 0 ||
    l.status === "paid" ||
    (contractAt >= 0 && !["refused", "noanswer"].includes(l.status) && statuses.findIndex((s) => s.id === l.status) >= contractAt);
  const inWork = (l: LeadLike) => !["new", "refused", "noanswer"].includes(l.status);
  const isChecklist = (l: LeadLike) => l.source === "чек-лист";

  const list = useMemo(() => {
    const from = days ? Date.now() - days * 86400000 : 0;
    return items.filter((l) => !from || Date.parse(l.created.replace(" ", "T") + "+03:00") >= from);
  }, [items, days]);
  const touch = (l: LeadLike): Touch | null => (l.src ? (mode === "first" && l.src.first ? l.src.first : l.src) : null);

  const group = (keyOf: (l: LeadLike) => string | null) => {
    const m = new Map<string, Row>();
    for (const l of list) {
      const k = keyOf(l);
      if (!k) continue;
      const r = m.get(k) || { key: k, leads: [], checklists: 0, work: 0, clients: 0, sum: 0 };
      r.leads.push(l);
      if (isChecklist(l)) r.checklists++;
      if (inWork(l)) r.work++;
      if (isClient(l)) {
        r.clients++;
        r.sum += l.amount || 0;
      }
      m.set(k, r);
    }
    return [...m.values()].sort((a, b) => b.clients - a.clients || b.leads.length - b.checklists - (a.leads.length - a.checklists) || b.leads.length - a.leads.length);
  };

  const tracked = list.filter((l) => l.src && !l.src.manual).length;
  const byChannel = group((l) => (l.src ? touchLabel(touch(l)) : "неизвестно (старые заявки, звонки, Telegram)"));
  const byLanding = group((l) => (l.src && !l.src.manual ? touch(l)?.landing || null : null));
  const byForm = group((l) => l.src?.form || (l.page.startsWith("http") ? pathOf(l.page) : null));
  const clients = list.filter(isClient).length;

  // Запросы, которые ведут на страницы входа с заявками
  const queryRows = useMemo(() => {
    if (!seo) return [];
    const out: { q: QRow; page: string; row: Row }[] = [];
    for (const r of byLanding) {
      for (const q of seo.pages[r.key]?.q.slice(0, 8) || []) out.push({ q, page: r.key, row: r });
    }
    return out.sort((a, b) => b.row.clients - a.row.clients || b.row.leads.length - a.row.leads.length || b.q[1] - a.q[1]).slice(0, 40);
  }, [seo, byLanding]);

  // Что усиливать: страницы с заявками, у которых главные запросы стоят на 4–20 месте
  const boost = useMemo(() => {
    if (!seo) return [];
    return byLanding
      .map((r) => ({ r, qs: (seo.pages[r.key]?.q || []).filter((q) => q[3] !== null && q[3] > 3 && q[3] <= 20 && q[2] >= 5).slice(0, 3) }))
      .filter((x) => x.qs.length > 0)
      .sort((a, b) => b.r.clients * 3 + b.r.leads.length - (a.r.clients * 3 + a.r.leads.length))
      .slice(0, 6);
  }, [seo, byLanding]);

  const visits = (p: string) => seo?.pages[p]?.v || {};
  const conv = (r: Row) => {
    const v = visits(r.key).total || 0;
    return v ? `${(((r.leads.length - r.checklists) / v) * 100).toFixed(1)}%` : "—";
  };

  const Leads = ({ r }: { r: Row }) => (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {r.leads.map((l) => (
        <li key={l.id}>
          <button
            onClick={() => onOpenLead(l.id)}
            className={`rounded-full px-2.5 py-1 text-[0.88em] ${isClient(l) ? "bg-green-100 text-green-900" : "bg-cream/[0.07]"}`}
          >
            № {l.id} {l.name}
            {isChecklist(l) ? " · чек-лист" : ""}
          </button>
        </li>
      ))}
    </ul>
  );

  const th = "px-3 py-2 text-left font-normal text-cream-muted";
  const td = "px-3 py-2 align-top";
  const Table = ({ rows, first, extra }: { rows: Row[]; first: string; extra?: boolean }) => (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table className="w-full min-w-[560px] text-[0.93em]">
        <thead>
          <tr className="border-b border-cream/10">
            <th className={th}>{first}</th>
            <th className={`${th} text-right`}>заявки</th>
            <th className={`${th} text-right`}>в работе</th>
            <th className={`${th} text-right`}>клиенты</th>
            {extra && <th className={`${th} text-right`}>визиты за 90 дн.</th>}
            {extra && <th className={`${th} text-right`}>визит → заявка</th>}
            {extra && <th className={th}>главные запросы</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const id = `${first}:${r.key}`;
            const qs = seo?.pages[r.key]?.q || [];
            return (
              <Fragment key={id}>
                <tr className="cursor-pointer border-b border-cream/5 hover:bg-cream/[0.04]" onClick={() => setOpen(open === id ? null : id)}>
                  <td className={`${td} max-w-[280px] break-all`}>
                    <Icon name={open === id ? "ChevronDown" : "ChevronRight"} size={14} className="mr-1 inline" />
                    {r.key}
                  </td>
                  <td className={`${td} text-right`}>
                    {r.leads.length - r.checklists}
                    {r.checklists > 0 && <span className="text-cream-muted"> +{r.checklists} ч/л</span>}
                  </td>
                  <td className={`${td} text-right`}>{r.work}</td>
                  <td className={`${td} text-right font-medium`}>
                    {r.clients}
                    {r.sum > 0 && <span className="block text-[0.85em] font-normal text-cream-muted">{r.sum.toLocaleString("ru-RU")} ₽</span>}
                  </td>
                  {extra && <td className={`${td} text-right`}>{visits(r.key).total ?? "—"}</td>}
                  {extra && <td className={`${td} text-right`}>{conv(r)}</td>}
                  {extra && (
                    <td className={`${td} text-[0.92em]`}>
                      {qs.slice(0, 2).map((q) => (
                        <div key={q[0]}>«{q[0]}»</div>
                      ))}
                      {!qs.length && <span className="text-cream-muted">—</span>}
                    </td>
                  )}
                </tr>
                {open === id && (
                  <tr className="border-b border-cream/5">
                    <td className={td} colSpan={extra ? 7 : 4}>
                      {extra && qs.length > 0 && (
                        <div className="mb-2">
                          <div className="text-cream-muted">запросы на эту страницу (Вебмастер): клики · показы · средняя позиция</div>
                          <ul className="mt-1 columns-1 gap-6 md:columns-2">
                            {qs.map((q) => (
                              <li key={q[0]} className="break-inside-avoid">
                                «{q[0]}» <span className="text-cream-muted">{q[1]} · {q[2]} · {q[3] ?? "—"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {extra && (visits(r.key).search ?? 0) > 0 && (
                        <div className="mb-2 text-cream-muted">
                          из поиска за 90 дней: {visits(r.key).search} визитов (Яндекс {visits(r.key).yandex ?? 0}, Google {visits(r.key).google ?? 0})
                        </div>
                      )}
                      <Leads r={r} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {!rows.length && (
            <tr>
              <td className={`${td} text-cream-muted`} colSpan={extra ? 7 : 4}>
                пока нет заявок с этими данными
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const chip = (on: boolean) => `rounded-full px-3.5 py-1.5 text-[0.9em] ${on ? "bg-foreground text-background" : "bg-cream/[0.06]"}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose} role="dialog" aria-modal="true" aria-label="Откуда заявки">
      <div
        className="docs-light flex h-full w-full max-w-[1000px] flex-col overflow-y-auto bg-background text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-background/95 px-5 py-4 backdrop-blur md:px-7">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">откуда заявки</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface docs-card" aria-label="Закрыть">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-4 px-5 pb-10 md:px-7">
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button key={p.id} className={chip(days === p.id)} onClick={() => setDays(p.id)}>
                {p.title}
              </button>
            ))}
            <span className="mx-1 hidden w-px bg-cream/10 md:block" />
            <button className={chip(mode === "first")} onClick={() => setMode("first")} title="Засчитывать заявку странице, с которой человек впервые пришёл на сайт">
              первый заход
            </button>
            <button className={chip(mode === "last")} onClick={() => setMode("last")} title="Засчитывать заявку заходу, в котором отправлена форма">
              заход с заявкой
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["заявок и чек-листов", list.length],
              ["с известным источником", tracked],
              ["клиентов", clients],
              ["оплачено", `${list.filter(isClient).reduce((s, l) => s + (l.amount || 0), 0).toLocaleString("ru-RU")} ₽`],
            ].map(([t, v]) => (
              <div key={String(t)} className="docs-card rounded-2xl bg-surface p-4 text-cream">
                <div className="text-[1.5em] font-semibold leading-none">{v}</div>
                <div className="mt-1.5 text-[0.88em] text-cream-muted">{t}</div>
              </div>
            ))}
          </div>
          {tracked < list.length && (
            <p className="text-[0.92em] text-cream-muted">
              Источник пишется в заявки с 23.11.2026. У старых заявок, звонков и сообщений в Telegram его нет: такие можно отметить вручную в карточке заявки.
              Страница с формой известна у всех заявок с сайта.
            </p>
          )}

          {boost.length > 0 && (
            <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
              <h3 className="font-medium">усилить в первую очередь</h3>
              <p className="mt-1 text-[0.9em] text-cream-muted">страницы, которые уже дают заявки, а их запросы стоят на 4–20 месте: поднять в топ-3</p>
              <ul className="mt-3 space-y-2.5">
                {boost.map(({ r, qs }) => (
                  <li key={r.key}>
                    <PageLink p={r.key} />{" "}
                    <span className="text-cream-muted">
                      · заявок {r.leads.length - r.checklists}, клиентов {r.clients}
                    </span>
                    <div className="text-[0.92em]">
                      {qs.map((q) => `«${q[0]}» (поз. ${q[3]}, ${q[2]} показов)`).join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">каналы</h3>
            <div className="mt-2">
              <Table rows={byChannel} first="канал" />
            </div>
          </section>

          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">страницы входа</h3>
            <p className="mt-1 text-[0.9em] text-cream-muted">
              с какой страницы человек зашёл на сайт{mode === "first" ? " в первый раз" : " в визите, где оставил заявку"}. Нажмите на строку: запросы и заявки
            </p>
            <div className="mt-2">
              <Table rows={byLanding} first="страница" extra />
            </div>
          </section>

          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">запросы, которые ведут на страницы с заявками</h3>
            <p className="mt-1 text-[0.9em] text-cream-muted">
              Яндекс и Google не передают сайту запрос конкретного человека, поэтому здесь запросы, по которым приходят на страницу входа
              {seo?.wm?.from ? ` (Вебмастер, ${dateRu(seo.wm.from)}–${dateRu(seo.wm.to)})` : ""}.
            </p>
            {seoErr && <p className="mt-2 text-red-700">{seoErr}</p>}
            {!seo && !seoErr && <p className="mt-2 text-cream-muted">данные Вебмастера ещё не загружены: они обновляются раз в день около 5:00 МСК</p>}
            {seo && (
              <div className="-mx-5 mt-2 overflow-x-auto px-5 md:mx-0 md:px-0">
                <table className="w-full min-w-[560px] text-[0.93em]">
                  <thead>
                    <tr className="border-b border-cream/10">
                      <th className={th}>запрос</th>
                      <th className={th}>страница</th>
                      <th className={`${th} text-right`}>клики</th>
                      <th className={`${th} text-right`}>позиция</th>
                      <th className={`${th} text-right`}>заявки / клиенты со страницы</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryRows.map(({ q, page, row }) => (
                      <tr key={`${page}:${q[0]}`} className="border-b border-cream/5">
                        <td className={td}>{q[0]}</td>
                        <td className={`${td} break-all`}>{page}</td>
                        <td className={`${td} text-right`}>{q[1]}</td>
                        <td className={`${td} text-right`}>{q[3] ?? "—"}</td>
                        <td className={`${td} text-right`}>
                          {row.leads.length - row.checklists} / {row.clients}
                        </td>
                      </tr>
                    ))}
                    {!queryRows.length && (
                      <tr>
                        <td className={`${td} text-cream-muted`} colSpan={5}>
                          пока нет заявок, пришедших из поиска на страницы, по которым есть данные Вебмастера
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">страницы, где отправили форму</h3>
            <p className="mt-1 text-[0.9em] text-cream-muted">известно и для старых заявок</p>
            <div className="mt-2">
              <Table rows={byForm} first="страница" />
            </div>
          </section>
          {seo?.updated && <p className="text-[0.85em] text-cream-muted">запросы и визиты обновлены {dateRu(seo.updated)}</p>}
        </div>
      </div>
    </div>
  );
};
