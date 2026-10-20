import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";

// Раздел «Заявки» в кабинете /dokumenty: все заявки с сайта (форма, чек-листы, оплаты)
// и добавленные вручную. Лиля и Алиса распределяют их по статусам и между собой.
// Сервер: api/crm.php (вход по тому же пин-коду, что и договоры).

const API = "/api/crm.php";

export type Lead = {
  id: number;
  created: string;
  name: string;
  phone: string;
  email: string;
  place: string;
  service: string;
  channel: string;
  comment: string;
  page: string;
  source: string;
  amount: number;
  status: string;
  owner: string;
  updated: string;
  notes: { at: string; who: string; text: string }[];
  history: { at: string; who: string; text: string }[];
};
type Status = { id: string; title: string };
type User = { id: string; name: string; tg: boolean };
type Me = { id: string; name: string; admin: boolean };

// Цвет точки у статуса: тёплые для работы, зелёный для оплаты, серые для закрытых
const DOT: Record<string, string> = {
  new: "#FFD900",
  work: "#F59E0B",
  call: "#3B82F6",
  kp: "#8B5CF6",
  contract: "#0EA5E9",
  paid: "#16A34A",
  noanswer: "#9CA3AF",
  refused: "#6B7280",
};

const field =
  "h-11 rounded-xl border-cream/20 bg-cream/5 px-4 text-[1em] text-cream placeholder:text-cream-muted/60 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0";

// «2026-10-21 00:37:04» → «21.10 в 00:37» (год, если не текущий)
const when = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(s || "");
  if (!m) return s;
  const year = String(new Date().getFullYear());
  return `${m[3]}.${m[2]}${m[1] !== year ? `.${m[1]}` : ""} в ${m[4]}:${m[5]}`;
};
const telHref = (p: string) => {
  const d = p.replace(/\D/g, "");
  if (d.length === 11) return `tel:+7${d.slice(1)}`;
  return d ? `tel:+${d}` : "";
};

const call = async (key: string, q: string, body?: unknown) => {
  const res = await fetch(`${API}?${q}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "X-Docs-Key": encodeURIComponent(key), ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Сервер не ответил");
  return data;
};

type Props = {
  docsKey: string;
  openId?: number;
  onContract: (lead: Lead) => void;
};

const Crm = ({ docsKey, openId, onContract }: Props) => {
  const [items, setItems] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [tgReady, setTgReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [who, setWho] = useState("all"); // all | mine | none | <id>
  const [mobileStatus, setMobileStatus] = useState("new");
  const [openLead, setOpenLead] = useState<number | null>(openId ?? null);
  const [adding, setAdding] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      try {
        const d = await call(docsKey, "a=list");
        setItems(d.items || []);
        setStatuses(d.statuses || []);
        setUsers(d.users || []);
        setMe(d.me || null);
        setTgReady(!!d.tg_ready);
        setErr("");
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [docsKey],
  );

  useEffect(() => {
    load();
    // Новые заявки подтягиваются сами раз в минуту, пока вкладка открыта
    const t = setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, 60000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const nameOf = (id: string) => users.find((u) => u.id === id)?.name || "";
  const statusTitle = (id: string) => statuses.find((s) => s.id === id)?.title || id;

  const visible = useMemo(() => {
    const s = q.trim().toLowerCase();
    const sd = s.replace(/\D/g, "");
    return items.filter((l) => {
      if (who === "mine" && l.owner !== me?.id) return false;
      if (who === "none" && l.owner !== "") return false;
      if (!["all", "mine", "none"].includes(who) && l.owner !== who) return false;
      if (!s) return true;
      const hay = `${l.name} ${l.place} ${l.service} ${l.comment} ${l.email} № ${l.id}`.toLowerCase();
      return hay.includes(s) || (sd.length >= 3 && l.phone.replace(/\D/g, "").includes(sd));
    });
  }, [items, q, who, me]);

  const byStatus = useMemo(() => {
    const m: Record<string, Lead[]> = {};
    for (const s of statuses) m[s.id] = [];
    for (const l of visible) (m[l.status] ||= []).push(l);
    return m;
  }, [visible, statuses]);

  const update = async (id: number, patch: { status?: string; owner?: string; note?: string }) => {
    const before = items;
    // сразу показываем изменение, сервер подтверждает
    setItems((xs) =>
      xs.map((l) =>
        l.id === id
          ? { ...l, ...(patch.status ? { status: patch.status } : {}), ...(patch.owner !== undefined ? { owner: patch.owner } : {}) }
          : l,
      ),
    );
    try {
      const d = await call(docsKey, "a=update", { id, ...patch });
      setItems((xs) => xs.map((l) => (l.id === id ? d.item : l)));
      if (patch.owner && patch.owner !== me?.id) {
        const u = users.find((x) => x.id === patch.owner);
        setToast(d.notified ? `${u?.name}: уведомление ушло в Telegram` : `Передано: ${u?.name}. Уведомления в Telegram не подключены, лучше сообщить лично`);
      }
      reachGoal("crm_update");
      return true;
    } catch (e) {
      setItems(before);
      setToast(`Не сохранилось: ${(e as Error).message}`);
      return false;
    }
  };

  const lead = items.find((l) => l.id === openLead) || null;
  const myTg = users.find((u) => u.id === me?.id)?.tg;
  const counts = (id: string) => (byStatus[id] || []).length;

  if (loading && !items.length)
    return (
      <div className="flex items-center gap-2 py-16 text-cream-muted">
        <Icon name="Loader2" size={18} className="animate-spin" /> загружаю заявки…
      </div>
    );

  return (
    <div className="mt-6">
      {err && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          {err}{" "}
          <button className="underline" onClick={() => load()}>
            повторить
          </button>
        </p>
      )}

      {/* Панель: поиск, фильтр по ответственной, новая заявка, Telegram */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 basis-[240px]">
          <Icon name="Search" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted" />
          <Input
            className={`${field} w-full pl-10`}
            placeholder="поиск: имя, телефон, заведение, № заявки"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Поиск по заявкам"
          />
        </div>
        <select
          value={who}
          onChange={(e) => setWho(e.target.value)}
          className="h-11 rounded-xl border border-cream/20 px-3 text-cream"
          aria-label="Чьи заявки показать"
        >
          <option value="all">все заявки</option>
          <option value="mine">мои</option>
          <option value="none">без ответственной</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-4 font-medium text-foreground"
        >
          <Icon name="Plus" size={16} /> заявка
        </button>
        <button
          onClick={() => load()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-cream docs-card"
          aria-label="Обновить"
          title="Обновить"
        >
          <Icon name="RotateCcw" size={16} />
        </button>
      </div>

      {tgReady && me && !myTg && <TgConnect docsKey={docsKey} name={me.name} onDone={() => load(true)} />}

      {/* Телефон: статусы чипами, под ними список выбранного статуса */}
      <div className="mt-5 md:hidden">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setMobileStatus(s.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.92em] ${
                mobileStatus === s.id ? "bg-foreground text-background" : "bg-surface text-cream docs-card"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: DOT[s.id] }} />
              {s.title}
              <span className="opacity-60">{counts(s.id)}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-3">
          {(byStatus[mobileStatus] || []).map((l) => (
            <LeadCard key={l.id} l={l} owner={nameOf(l.owner)} onOpen={() => setOpenLead(l.id)} />
          ))}
          {!(byStatus[mobileStatus] || []).length && <p className="py-8 text-center text-cream-muted">здесь пусто</p>}
        </div>
      </div>

      {/* Компьютер: доска, карточки перетаскиваются между колонками */}
      <div className="mt-5 hidden gap-3 overflow-x-auto pb-4 md:flex">
        {statuses.map((s) => (
          <section
            key={s.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(s.id);
            }}
            onDragLeave={() => setOverCol((c) => (c === s.id ? "" : c))}
            onDrop={(e) => {
              e.preventDefault();
              setOverCol("");
              const id = dragId;
              setDragId(null);
              const l = items.find((x) => x.id === id);
              if (l && l.status !== s.id) update(l.id, { status: s.id });
            }}
            className={`flex w-[256px] shrink-0 flex-col rounded-[20px] p-2 transition-colors ${
              overCol === s.id ? "bg-brand/30" : "bg-cream/[0.04]"
            }`}
          >
            <header className="flex items-center gap-2 px-2 py-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: DOT[s.id] }} />
              <h2 className="font-medium">{s.title}</h2>
              <span className="ml-auto text-[0.9em] text-cream-muted">{counts(s.id)}</span>
            </header>
            <div className="flex max-h-[calc(100vh-280px)] min-h-[120px] flex-col gap-2 overflow-y-auto p-0.5">
              {(byStatus[s.id] || []).map((l) => (
                <LeadCard
                  key={l.id}
                  l={l}
                  owner={nameOf(l.owner)}
                  onOpen={() => setOpenLead(l.id)}
                  draggable
                  onDragStart={() => setDragId(l.id)}
                  dragging={dragId === l.id}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {lead && (
        <LeadPanel
          l={lead}
          statuses={statuses}
          users={users}
          statusTitle={statusTitle}
          meId={me?.id || ""}
          onClose={() => setOpenLead(null)}
          onUpdate={(p) => update(lead.id, p)}
          onContract={() => onContract(lead)}
        />
      )}
      {adding && (
        <AddLead
          docsKey={docsKey}
          users={users}
          onClose={() => setAdding(false)}
          onAdded={(l) => {
            setItems((xs) => [l, ...xs]);
            setAdding(false);
            setMobileStatus("new");
            setToast(`Заявка № ${l.id} добавлена`);
          }}
        />
      )}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-2xl bg-foreground px-5 py-3 text-center text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

// --- Карточка на доске ------------------------------------------------------
const LeadCard = ({
  l,
  owner,
  onOpen,
  draggable,
  onDragStart,
  dragging,
}: {
  l: Lead;
  owner: string;
  onOpen: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  dragging?: boolean;
}) => (
  <button
    type="button"
    onClick={onOpen}
    draggable={draggable}
    onDragStart={(e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(l.id));
      onDragStart?.();
    }}
    className={`docs-card w-full rounded-2xl bg-surface p-4 text-left text-cream transition-opacity ${dragging ? "opacity-40" : ""} ${
      draggable ? "cursor-grab active:cursor-grabbing" : ""
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <span className="font-medium leading-snug">{l.name || "без имени"}</span>
      <span className="shrink-0 text-[max(12px,0.78em)] text-cream-muted">№ {l.id}</span>
    </div>
    {l.place && <p className="mt-1 text-[0.92em] leading-snug">{l.place}</p>}
    {l.service && <p className="mt-1 text-[max(12px,0.85em)] leading-snug text-cream-muted">{l.service}</p>}
    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[max(12px,0.78em)]">
      <span className="text-cream-muted">{when(l.created)}</span>
      {l.source !== "форма" && <span className="rounded-full bg-cream/[0.07] px-2 py-0.5">{l.source}</span>}
      {l.amount > 0 && <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">{l.amount.toLocaleString("ru-RU")} ₽</span>}
      {l.notes.length > 0 && (
        <span className="inline-flex items-center gap-1 text-cream-muted">
          <Icon name="MessageCircle" size={12} />
          {l.notes.length}
        </span>
      )}
      <span className={`ml-auto rounded-full px-2 py-0.5 ${owner ? "bg-brand/60" : "bg-cream/[0.07] text-cream-muted"}`}>
        {owner || "никто"}
      </span>
    </div>
  </button>
);

// --- Карточка заявки целиком -------------------------------------------------
const LeadPanel = ({
  l,
  statuses,
  users,
  statusTitle,
  meId,
  onClose,
  onUpdate,
  onContract,
}: {
  l: Lead;
  statuses: Status[];
  users: User[];
  statusTitle: (id: string) => string;
  meId: string;
  onClose: () => void;
  onUpdate: (p: { status?: string; owner?: string; note?: string }) => Promise<boolean>;
  onContract: () => void;
}) => {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const addNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    if (await onUpdate({ note: note.trim() })) setNote("");
    setBusy(false);
  };
  const tel = telHref(l.phone);
  const feed = [
    ...l.notes.map((n) => ({ ...n, kind: "note" as const })),
    ...l.history.map((h) => ({ ...h, kind: "log" as const })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="docs-light flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-background text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-background/95 px-5 py-4 backdrop-blur md:px-7">
          <span className="text-cream-muted">заявка № {l.id}</span>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface docs-card" aria-label="Закрыть">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-4 px-5 pb-10 md:px-7">
          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h2 className="font-display text-[1.5em] font-semibold leading-tight tracking-[-0.02em]">{l.name || "без имени"}</h2>
            {l.place && <p className="mt-1 text-[1.05em]">{l.place}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {tel && (
                <a href={tel} className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-4 font-medium text-foreground">
                  <Icon name="Phone" size={16} /> {l.phone}
                </a>
              )}
              {l.phone && (
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(l.phone).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    });
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-cream/[0.06] px-4"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={16} /> {copied ? "скопирован" : "копировать"}
                </button>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[0.95em]">
              {l.service && (
                <>
                  <dt className="text-cream-muted">услуга</dt>
                  <dd>{l.service}</dd>
                </>
              )}
              {l.channel && (
                <>
                  <dt className="text-cream-muted">связь</dt>
                  <dd>{l.channel}</dd>
                </>
              )}
              {l.email && (
                <>
                  <dt className="text-cream-muted">почта</dt>
                  <dd className="break-all">
                    <a className="underline" href={`mailto:${l.email}`}>
                      {l.email}
                    </a>
                  </dd>
                </>
              )}
              {l.comment && (
                <>
                  <dt className="text-cream-muted">комментарий</dt>
                  <dd className="whitespace-pre-line">{l.comment}</dd>
                </>
              )}
              <dt className="text-cream-muted">пришла</dt>
              <dd>
                {when(l.created)}, {l.source}
              </dd>
              {l.page.startsWith("http") && (
                <>
                  <dt className="text-cream-muted">страница</dt>
                  <dd className="break-all">
                    <a className="underline" href={l.page} target="_blank" rel="noreferrer">
                      {l.page.replace(/^https?:\/\/(www\.)?agregatory\.pro/, "") || "/"}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>

          {!l.owner && meId && (
            <button
              onClick={() => onUpdate({ owner: meId, ...(l.status === "new" ? { status: "work" } : {}) })}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-medium text-foreground"
            >
              <Icon name="UserCheck" size={18} /> взять себе
            </button>
          )}
          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">статус</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => s.id !== l.status && onUpdate({ status: s.id })}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.92em] ${
                    l.status === s.id ? "bg-foreground text-background" : "bg-cream/[0.06]"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: DOT[s.id] }} />
                  {s.title}
                </button>
              ))}
            </div>
            <h3 className="mt-5 font-medium">кто ведёт</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => u.id !== l.owner && onUpdate({ owner: u.id })}
                  className={`rounded-full px-4 py-2 text-[0.92em] ${l.owner === u.id ? "bg-brand font-medium text-foreground" : "bg-cream/[0.06]"}`}
                >
                  {u.name}
                </button>
              ))}
              {l.owner && (
                <button onClick={() => onUpdate({ owner: "" })} className="rounded-full px-4 py-2 text-[0.92em] text-cream-muted underline">
                  снять
                </button>
              )}
            </div>
            <button
              onClick={onContract}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-medium text-background"
            >
              <Icon name="FileSignature" size={16} /> оформить договор по заявке
            </button>
          </section>

          <section className="docs-card rounded-[24px] bg-surface p-5 text-cream">
            <h3 className="font-medium">комментарии и история</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote();
              }}
              rows={3}
              placeholder="что выяснили, о чём договорились, когда перезвонить"
              className="mt-3 w-full rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              onClick={addNote}
              disabled={busy || !note.trim()}
              className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 font-medium text-foreground disabled:opacity-50"
            >
              {busy ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Send" size={16} />} добавить
            </button>
            <ul className="mt-5 space-y-3">
              {feed.map((f, i) => (
                <li key={i} className={f.kind === "note" ? "rounded-xl bg-pale/60 px-4 py-3" : "px-1 text-[0.9em] text-cream-muted"}>
                  <div className="text-[max(12px,0.8em)] text-cream-muted">
                    {when(f.at)}, {f.who}
                  </div>
                  <div className="whitespace-pre-line">{f.text}</div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[max(12px,0.8em)] text-cream-muted">Сейчас: {statusTitle(l.status)}. Изменено {when(l.updated)}.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- Заявка вручную (звонок, сообщение в Telegram) --------------------------
const AddLead = ({
  docsKey,
  users,
  onClose,
  onAdded,
}: {
  docsKey: string;
  users: User[];
  onClose: () => void;
  onAdded: (l: Lead) => void;
}) => {
  const [f, setF] = useState({ name: "", phone: "", place: "", service: "", channel: "", comment: "", owner: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() && !f.phone.trim()) return setErr("Нужно имя или телефон");
    setBusy(true);
    setErr("");
    try {
      const d = await call(docsKey, "a=add", f);
      reachGoal("crm_add");
      onAdded(d.item);
    } catch (er) {
      setErr((er as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 md:items-center" onClick={onClose} role="dialog" aria-modal="true">
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="docs-light docs-card max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-[24px] bg-surface p-6 text-cream md:rounded-[24px]"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">новая заявка</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/[0.06]" aria-label="Закрыть">
            <Icon name="X" size={18} />
          </button>
        </div>
        <p className="mt-1 text-[0.92em] text-cream-muted">Например, ресторан позвонил или написал в Telegram.</p>
        <div className="mt-4 space-y-3">
          <Input className={`${field} w-full`} placeholder="имя" value={f.name} onChange={set("name")} aria-label="Имя" autoFocus />
          <Input className={`${field} w-full`} placeholder="телефон" inputMode="tel" value={f.phone} onChange={set("phone")} aria-label="Телефон" />
          <Input className={`${field} w-full`} placeholder="заведение и город" value={f.place} onChange={set("place")} aria-label="Заведение" />
          <Input className={`${field} w-full`} placeholder="что нужно: сопровождение, аудит, консультация" value={f.service} onChange={set("service")} aria-label="Услуга" />
          <Input className={`${field} w-full`} placeholder="откуда: звонок, Telegram, рекомендация" value={f.channel} onChange={set("channel")} aria-label="Откуда" />
          <textarea
            value={f.comment}
            onChange={set("comment")}
            rows={3}
            placeholder="комментарий"
            className="w-full rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <select value={f.owner} onChange={set("owner")} className="h-11 w-full rounded-xl border border-cream/20 px-3 text-cream" aria-label="Ответственная">
            <option value="">ответственная: пока никто</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                ответственная: {u.name}
              </option>
            ))}
          </select>
        </div>
        {err && <p className="mt-3 text-red-600">{err}</p>}
        <button disabled={busy} className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand font-medium text-foreground disabled:opacity-60">
          {busy ? <Icon name="Loader2" size={18} className="animate-spin" /> : "добавить заявку"}
        </button>
      </form>
    </div>
  );
};

// --- Личные уведомления в Telegram ------------------------------------------
const TgConnect = ({ docsKey, name, onDone }: { docsKey: string; name: string; onDone: () => void }) => {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("crm-tg-hide") === "1";
    } catch {
      return false;
    }
  });
  if (hidden) return null;
  const start = async () => {
    setBusy(true);
    setMsg("");
    try {
      const d = await call(docsKey, "a=tglink", {});
      setUrl(d.url);
      window.open(d.url, "_blank", "noopener");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const check = async () => {
    setBusy(true);
    setMsg("");
    try {
      const d = await call(docsKey, "a=tgcheck", {});
      if (d.ok) onDone();
      else setMsg(d.error);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="docs-card mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-pale/70 px-5 py-4 text-cream">
      <Icon name="Send" size={18} />
      <p className="min-w-0 flex-1 basis-[240px] text-[0.95em]">
        {name}, подключи уведомления: если кто-то передаст заявку именно тебе, бот сразу пришлёт её в Telegram.
        {url && " Открой бота, нажми «Старт», потом «проверить»."}
      </p>
      {!url ? (
        <button onClick={start} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-4 font-medium text-background">
          {busy ? <Icon name="Loader2" size={16} className="animate-spin" /> : "подключить"}
        </button>
      ) : (
        <>
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-xl bg-surface px-4 underline">
            открыть бота
          </a>
          <button onClick={check} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-4 font-medium text-background">
            {busy ? <Icon name="Loader2" size={16} className="animate-spin" /> : "проверить"}
          </button>
        </>
      )}
      <button
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem("crm-tg-hide", "1");
          } catch {
            /* приватный режим */
          }
        }}
        className="text-[0.9em] text-cream-muted underline"
      >
        позже
      </button>
      {msg && <p className="w-full text-[0.9em] text-red-700">{msg}</p>}
    </div>
  );
};

export default Crm;
