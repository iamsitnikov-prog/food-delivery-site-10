import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import {
  dateWords,
  decryptTemplate,
  genderOf,
  genitive,
  money,
  monthYear,
  numberWords,
  plural,
  renderDocx,
  shortName,
  titleCase,
  type Gender,
} from "@/lib/docs-gen";
import { EXECUTORS, getExecutor } from "@/data/executors";
import { renderForPrint } from "@/lib/docs-pdf";

// Закрытая страница для бухгалтера: договор с рестораном (ИП или ООО) по шаблонам Юрия.
// Договор собирается здесь, в браузере; сервер (api/docs.php) проверяет пароль,
// ищет реквизиты по ИНН, ведёт журнал и присылает копию Юрию в Telegram.

const API = "/api/docs.php";
const KEY_STORE = "agd-key";

type Kind = "ooo" | "ip";
type Point = { title: string; address: string; city: string };
type Journal = { id: number; num: string; version?: number; client: string; executor?: string; inn: string; total: number; points: number; created: string; has_form?: boolean }[];

const thisMonth = () => new Date().toISOString().slice(0, 7);
const digits = (s: string) => s.replace(/\D/g, "");

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORE) || "";
  } catch {
    return "";
  }
};
const writeKey = (v: string) => {
  try {
    if (v) sessionStorage.setItem(KEY_STORE, v);
    else sessionStorage.removeItem(KEY_STORE);
  } catch {
    /* приватный режим: просто не запоминаем */
  }
};

const api = async (key: string, q: string, init?: RequestInit) => {
  const res = await fetch(`${API}?${q}`, {
    ...init,
    headers: { ...(init?.headers || {}), "X-Docs-Key": encodeURIComponent(key) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Сервер не ответил");
  return data;
};

const EDO = ["СБИС", "Контур.Диадок", "Такском", "Калуга Астрал", "Другой оператор", "Нет ЭДО"];

const field =
  "h-12 rounded-xl border-cream/20 bg-cream/5 px-4 text-[1em] text-cream placeholder:text-cream-muted/60 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0";

const Label = ({ t, hint, children, wide }: { t: string; hint?: string; children: React.ReactNode; wide?: boolean }) => (
  <label className={`block ${wide ? "md:col-span-2" : ""}`}>
    <span className="mb-1.5 block text-[max(12px,0.86em)] font-medium text-cream-muted">{t}</span>
    {children}
    {hint && <span className="mt-1 block text-[max(12px,0.78em)] text-cream-muted/70">{hint}</span>}
  </label>
);

const Card = ({ n, t, children }: { n: number; t: string; children: React.ReactNode }) => (
  <section className="rounded-[24px] bg-surface p-5 text-cream md:p-8">
    <h2 className="flex items-center gap-3 font-display text-[1.3em] font-semibold tracking-[-0.02em]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-[0.8em] text-foreground">{n}</span>
      {t}
    </h2>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
  </section>
);

const Docs = () => {
  const { pathname } = useLocation();
  useSeo({
    title: "Документы | agregatory.pro",
    description: "Служебная страница agregatory.pro для подготовки договоров с ресторанами. Доступ только у сотрудников по паролю.",
    path: pathname,
    noindex: true,
  });

  const [key, setKey] = useState("");
  const [pw, setPw] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    const k = readKey();
    if (!k) return;
    api(k, "a=login", { method: "POST" })
      .then(() => setKey(k))
      .catch(() => writeKey(""));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthErr("");
    try {
      await api(pw.trim(), "a=login", { method: "POST" });
      writeKey(pw.trim());
      setKey(pw.trim());
    } catch (err) {
      setAuthErr((err as Error).message);
    } finally {
      setAuthBusy(false);
    }
  };

  // --- Данные формы ---------------------------------------------------------
  const [kind, setKind] = useState<Kind>("ooo");
  const [executor, setExecutor] = useState(EXECUTORS[0].id as string);
  const [num, setNum] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState(thisMonth());
  const [inn, setInn] = useState("");
  const [name, setName] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [kpp, setKpp] = useState("");
  const [address, setAddress] = useState("");
  const [person, setPerson] = useState(""); // ФИО руководителя ООО или ИП
  const [gender, setGender] = useState<Gender>("male");
  const [position, setPosition] = useState<"Генеральный директор" | "Директор">("Генеральный директор");
  const [basis, setBasis] = useState<"Устав" | "Доверенность">("Устав");
  const [proxy, setProxy] = useState("");
  const [personGen, setPersonGen] = useState("");
  const [bank, setBank] = useState("");
  const [rs, setRs] = useState("");
  const [bik, setBik] = useState("");
  const [ks, setKs] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [edo, setEdo] = useState(EDO[0]);
  const [edoId, setEdoId] = useState("");
  const [contact, setContact] = useState("");
  const [points, setPoints] = useState<Point[]>([{ title: "", address: "", city: "" }]);
  const [price, setPrice] = useState("25000");

  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMsg, setLookupMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ blob: Blob; file: string } | null>(null);
  const [journal, setJournal] = useState<Journal>([]);
  const [dupe, setDupe] = useState("");
  const [histBusy, setHistBusy] = useState<number | null>(null);
  const exec = getExecutor(executor);

  const loadJournal = () => key && api(key, "a=journal").then((d) => setJournal(d.items || [])).catch(() => {});
  useEffect(() => {
    loadJournal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Пол и родительный падеж ФИО пересчитываются при вводе, бухгалтер может поправить вручную
  useEffect(() => {
    if (!person.trim()) {
      setPersonGen("");
      return;
    }
    const g = genderOf(person);
    setGender(g);
    let alive = true;
    genitive(person, g).then((v) => alive && setPersonGen(v));
    return () => {
      alive = false;
    };
  }, [person]);

  useEffect(() => {
    if (!num.trim() || !key) return setDupe("");
    const t = setTimeout(() => {
      api(key, `a=check&num=${encodeURIComponent(num.trim())}`)
        .then((d) =>
          setDupe(
            d.exists
              ? `Договор № ${d.item.num} уже есть (${d.item.client}, ${d.item.created}). Новый сохранится как версия ${d.versions + 1}, прошлые останутся в журнале.`
              : "",
          ),
        )
        .catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [num, key]);

  const priceNum = Number(digits(price)) || 0;
  const filledPoints = points.filter((p) => p.title.trim() || p.address.trim());
  const pointsN = Math.max(filledPoints.length, 1);
  const total = priceNum * pointsN;
  const fem = gender === "female";
  const posGen = position === "Генеральный директор" ? "генерального директора" : "директора";
  const basisText = basis === "Устав" ? "Устава" : `доверенности ${proxy.trim()}`.trim();
  const clientTitle = kind === "ooo" ? `ООО «${name.trim()}»` : `ИП ${person.trim()}`;

  const preview = useMemo(() => {
    if (kind === "ooo")
      return `Общество с ограниченной ответственностью «${name}» (ОГРН ${ogrn}, ИНН ${inn}, КПП ${kpp}), в лице ${posGen} ${personGen}, ${fem ? "действующей" : "действующего"} на основании ${basisText}, именуемое в дальнейшем «Заказчик»`;
    return `Индивидуальный предприниматель ${person} (ОГРНИП ${ogrn}, ИНН ${inn}), ${fem ? "действующая" : "действующий"} на основании записи в ЕГРИП, ${fem ? "именуемая" : "именуемый"} в дальнейшем «Заказчик»`;
  }, [kind, name, ogrn, inn, kpp, posGen, personGen, fem, basisText, person]);

  const lookup = async () => {
    setLookupBusy(true);
    setLookupMsg("");
    try {
      const { row } = await api(key, `a=lookup&inn=${digits(inn)}`);
      if (row.closed) setLookupMsg("Внимание: по данным налоговой деятельность прекращена.");
      setKind(row.kind);
      setOgrn(row.ogrn);
      setInn(row.inn);
      if (row.kind === "ooo") {
        const m = /[«"](.+)[»"]/.exec(row.short || row.full);
        setName(m ? titleCase(m[1]).replace(/^./, (c: string) => c.toUpperCase()) : titleCase(row.full));
        setKpp(row.kpp);
        setAddress(row.address);
        const head = /:\s*(.+)$/.exec(row.head || "");
        if (head) setPerson(titleCase(head[1]));
        if (/^ДИРЕКТОР/i.test(row.head || "")) setPosition("Директор");
        else setPosition("Генеральный директор");
      } else {
        setPerson(titleCase(row.full));
      }
      if (!row.closed) setLookupMsg("Заполнено из ЕГРЮЛ. Проверьте и поправьте написание, если нужно.");
    } catch (err) {
      setLookupMsg((err as Error).message);
    } finally {
      setLookupBusy(false);
    }
  };

  const snapshot = () => ({
    kind, executor, num, date, month, inn, name, ogrn, kpp, address, person, gender, position, basis, proxy, personGen,
    bank, rs, bik, ks, phone, email, edo, edoId, contact, points, price,
  });
  type Snap = ReturnType<typeof snapshot>;
  const restore = (f: Partial<Snap>) => {
    const set = <T,>(v: T | undefined, fn: (x: T) => void) => v !== undefined && fn(v);
    set(f.kind, setKind); set(f.executor, setExecutor); set(f.num, setNum); set(f.date, setDate); set(f.month, setMonth);
    set(f.inn, setInn); set(f.name, setName); set(f.ogrn, setOgrn); set(f.kpp, setKpp); set(f.address, setAddress);
    set(f.person, setPerson); set(f.position, setPosition); set(f.basis, setBasis); set(f.proxy, setProxy);
    set(f.bank, setBank); set(f.rs, setRs); set(f.bik, setBik); set(f.ks, setKs); set(f.phone, setPhone); set(f.email, setEmail);
    set(f.edo, setEdo); set(f.edoId, setEdoId); set(f.contact, setContact); set(f.points, setPoints); set(f.price, setPrice);
    // Пол и падеж пересчитываются из ФИО; ставим сохранённые после пересчёта
    setTimeout(() => {
      set(f.gender, setGender);
      set(f.personGen, setPersonGen);
    }, 300);
    setResult(null);
    setErrors([]);
    setMsg("Данные загружены из журнала. Поправьте, что нужно, и сформируйте договор заново.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fillFrom = async (id: number) => {
    setHistBusy(id);
    try {
      const { form } = await api(key, `a=form&id=${id}`);
      restore(form);
    } catch (err) {
      setMsg(`Ошибка: ${(err as Error).message}`);
    } finally {
      setHistBusy(null);
    }
  };

  const fileFrom = async (id: number, num: string) => {
    const res = await fetch(`${API}?a=file&id=${id}`, { headers: { "X-Docs-Key": encodeURIComponent(key) }, cache: "no-store" });
    if (!res.ok) throw new Error("Файл не найден");
    return { blob: await res.blob(), file: `Договор ${num}`.replace(/[\\/:*?"<>|«»]+/g, " ") };
  };

  const validate = () => {
    const e: string[] = [];
    if (exec.missing.length) e.push(`У исполнителя ${exec.label} не заполнено: ${exec.missing.join(", ")}`);
    if (!num.trim()) e.push("Номер договора");
    if (!date) e.push("Дата договора (выберите в календаре)");
    if (!/^\d{10}$|^\d{12}$/.test(digits(inn))) e.push("ИНН: 10 цифр у ООО, 12 у ИП");
    if (kind === "ooo") {
      if (!name.trim()) e.push("Название ООО");
      if (!/^\d{13}$/.test(digits(ogrn))) e.push("ОГРН: 13 цифр");
      if (!/^\d{9}$/.test(digits(kpp))) e.push("КПП: 9 цифр");
      if (basis === "Доверенность" && !proxy.trim()) e.push("Номер и дата доверенности");
    } else if (!/^\d{15}$/.test(digits(ogrn))) e.push("ОГРНИП: 15 цифр");
    if (person.trim().split(/\s+/).length < 2) e.push(kind === "ooo" ? "ФИО руководителя" : "ФИО предпринимателя");
    if (!address.trim()) e.push("Адрес");
    if (!bank.trim()) e.push("Банк");
    if (!/^\d{20}$/.test(digits(rs))) e.push("Расчётный счёт: 20 цифр");
    if (!/^\d{9}$/.test(digits(bik))) e.push("БИК: 9 цифр");
    if (!/^\d{20}$/.test(digits(ks))) e.push("Корр. счёт: 20 цифр");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.push("Электронная почта (на неё идут юридически значимые сообщения, п. 15.1)");
    if (!phone.trim()) e.push("Телефон");
    if (!filledPoints.length || filledPoints.some((p) => !p.title.trim() || !p.address.trim() || !p.city.trim()))
      e.push("Точки: название, адрес и город у каждой");
    if (!priceNum) e.push("Стоимость за точку");
    setErrors(e);
    return e.length === 0;
  };

  const data = () => ({
    ...exec.data,
    num: num.trim(),
    date: dateWords(date),
    month_year: monthYear(month),
    total: money(total),
    total_words: numberWords(total),
    price: money(priceNum),
    points_phrase: `${pointsN} (${numberWords(pointsN, true)}) ${plural(pointsN, "точка, указанная", "точки, указанные", "точек, указанных")} в Приложении № 1 к Договору`,
    inn: digits(inn),
    address: address.trim(),
    short: shortName(person),
    bank: bank.trim(),
    rs: digits(rs),
    bik: digits(bik),
    ks: digits(ks),
    phone: phone.trim(),
    email: email.trim(),
    edo_operator: edo,
    edo_id: edo === "Нет ЭДО" ? "—" : edoId.trim() || "—",
    contact: contact.trim() || person.trim(),
    points: filledPoints.map((p, i) => ({ n: i + 1, title: p.title.trim(), address: p.address.trim(), city: p.city.trim() })),
    // ООО
    name: name.trim(),
    ogrn: digits(ogrn),
    kpp: digits(kpp),
    sign_position: position,
    sign_pos_gen: posGen,
    dir_full: person.trim(),
    dir_gen: personGen.trim(),
    signer_acting: fem ? "действующей" : "действующего",
    basis_text: basisText,
    // ИП
    fio: person.trim(),
    ogrnip: digits(ogrn),
    acting: fem ? "действующая" : "действующий",
    named: fem ? "именуемая" : "именуемый",
  });

  const generate = async () => {
    setMsg("");
    setResult(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const enc = await fetch(`/api/docs/${kind}.docx.enc`, { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error("Шаблон не загрузился");
        return r.arrayBuffer();
      });
      const tpl = await decryptTemplate(enc, key);
      const blob = await renderDocx(tpl, data());
      const file = `Договор ${num.trim()} ${clientTitle}`.replace(/[\\/:*?"<>|«»]+/g, " ").replace(/\s+/g, " ").trim();
      setResult({ blob, file });

      const fd = new FormData();
      fd.append("docx", blob, `${file}.docx`);
      fd.append(
        "meta",
        JSON.stringify({
          num: num.trim(), client: clientTitle, inn: digits(inn), total, points: pointsN, date: dateWords(date),
          executor: exec.label, form: snapshot(),
        }),
      );
      const saved = await api(key, "a=save", { method: "POST", body: fd });
      const v = saved.version > 1 ? ` (версия ${saved.version})` : "";
      setMsg(saved.telegram ? `Договор готов${v}. Сохранён в журнале, копия отправлена Юрию в Telegram.` : `Договор готов${v} и сохранён в журнале.`);
      loadJournal();
    } catch (err) {
      setMsg(`Ошибка: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const downloadWord = (r = result) => {
    if (!r) return;
    const result = r;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(result.blob);
    a.download = `${result.file}.docx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  // PDF: рисуем договор в скрытом окне шириной с текст страницы A4 и открываем печать → «Сохранить как PDF»
  const printPdf = async (r = result) => {
    if (!r) return;
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;left:-10000px;top:0;width:624px;height:900px;border:0";
    document.body.appendChild(frame);
    await renderForPrint(r.blob, frame, r.file.replace(/\.docx$/i, ""));
    frame.contentWindow!.focus();
    frame.contentWindow!.print();
    setTimeout(() => frame.remove(), 60000);
  };

  const setPoint = (i: number, k: keyof Point, v: string) =>
    setPoints((ps) => ps.map((p, j) => (j === i ? { ...p, [k]: v } : p)));

  // --- Вход -------------------------------------------------------------------
  if (!key)
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
        <form onSubmit={login} className="w-full max-w-[420px] rounded-[28px] bg-surface p-7 text-cream md:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-foreground">
            <Icon name="Lock" size={22} />
          </span>
          <h1 className="mt-6 font-display text-[1.9em] font-semibold leading-none tracking-[-0.02em]">документы</h1>
          <p className="mt-3 text-cream-muted">Служебная страница для подготовки договоров. Введите пин-код.</p>
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            className={`${field} mt-6 text-center text-[1.4em] tracking-[0.5em]`}
            placeholder="••••"
            maxLength={8}
            value={pw}
            onChange={(e) => setPw(e.target.value.replace(/\D/g, ""))}
            aria-label="Пин-код"
          />
          {authErr && <p className="mt-2 text-[max(12px,0.86em)] text-destructive">{authErr}</p>}
          <button
            disabled={authBusy || !pw.trim()}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand font-medium text-foreground disabled:opacity-60"
          >
            {authBusy ? <Icon name="Loader2" size={18} className="animate-spin" /> : "войти"}
          </button>
        </form>
      </main>
    );

  // --- Форма ------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-5 py-8 md:px-14 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
              договор с рестораном
            </h1>
            <p className="mt-3 max-w-[640px] text-foreground/75">
              Заполните данные, которые прислал ресторан. Договор с Приложениями 1–4 соберётся по шаблону Юрия, текст
              шаблона не меняется. Word можно поправить вручную, PDF подходит для отправки клиенту.
            </p>
          </div>
          <button
            onClick={() => {
              writeKey("");
              setKey("");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-[0.95em] font-medium text-cream"
          >
            <Icon name="LogOut" size={16} /> выйти
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Card n={1} t="Исполнитель">
              <div className="flex flex-col gap-2 md:col-span-2 md:flex-row" role="radiogroup" aria-label="Исполнитель">
                {EXECUTORS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={executor === x.id}
                    onClick={() => setExecutor(x.id)}
                    className={`flex-1 rounded-xl px-4 py-3 text-left font-medium ${executor === x.id ? "bg-brand text-foreground" : "bg-cream/10 text-cream"}`}
                  >
                    {x.label}
                    <span className={`block text-[0.8em] font-normal ${executor === x.id ? "text-foreground/70" : "text-cream-muted"}`}>
                      ИНН {x.data.e_inn} · {x.data.e_tax_gen.match(/\((\S+)\)/)?.[1]}
                    </span>
                  </button>
                ))}
              </div>
              {exec.missing.length > 0 && (
                <p className="text-[max(12px,0.86em)] text-brand md:col-span-2">
                  Не хватает данных исполнителя: {exec.missing.join(", ")}. Договор от этого исполнителя пока сформировать нельзя.
                </p>
              )}
            </Card>

            <Card n={2} t="Заказчик">
              <div className="flex gap-2 md:col-span-2" role="radiogroup" aria-label="Форма заказчика">
                {(["ooo", "ip"] as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    onClick={() => setKind(k)}
                    className={`flex-1 rounded-xl px-4 py-3 font-medium ${kind === k ? "bg-brand text-foreground" : "bg-cream/10 text-cream"}`}
                  >
                    {k === "ooo" ? "ООО" : "ИП"}
                  </button>
                ))}
              </div>
              <Label t="ИНН" hint="Нажмите «найти», и реквизиты подтянутся из реестра налоговой">
                <div className="flex gap-2">
                  <Input className={field} inputMode="numeric" value={inn} onChange={(e) => setInn(digits(e.target.value).slice(0, 12))} />
                  <button
                    type="button"
                    onClick={lookup}
                    disabled={lookupBusy || ![10, 12].includes(digits(inn).length)}
                    className="shrink-0 rounded-xl bg-brand px-4 font-medium text-foreground disabled:opacity-50"
                  >
                    {lookupBusy ? <Icon name="Loader2" size={18} className="animate-spin" /> : "найти"}
                  </button>
                </div>
              </Label>
              <Label t={kind === "ooo" ? "ОГРН" : "ОГРНИП"}>
                <Input className={field} inputMode="numeric" value={ogrn} onChange={(e) => setOgrn(digits(e.target.value).slice(0, 15))} />
              </Label>
              {lookupMsg && <p className="text-[max(12px,0.86em)] text-brand md:col-span-2">{lookupMsg}</p>}
              {kind === "ooo" ? (
                <>
                  <Label t="Название ООО (без кавычек)">
                    <Input className={field} value={name} onChange={(e) => setName(e.target.value)} />
                  </Label>
                  <Label t="КПП">
                    <Input className={field} inputMode="numeric" value={kpp} onChange={(e) => setKpp(digits(e.target.value).slice(0, 9))} />
                  </Label>
                </>
              ) : null}
              <Label t={kind === "ooo" ? "Юридический адрес" : "Адрес регистрации ИП"} wide>
                <Input className={field} value={address} onChange={(e) => setAddress(e.target.value)} />
              </Label>
            </Card>

            <Card n={3} t={kind === "ooo" ? "Кто подписывает" : "Предприниматель"}>
              <Label t={kind === "ooo" ? "ФИО руководителя полностью" : "ФИО полностью"} hint="Например: Иванов Иван Иванович">
                <Input className={field} value={person} onChange={(e) => setPerson(e.target.value)} />
              </Label>
              <Label t="Пол (для «действующий / действующая»)">
                <select
                  className={`${field} w-full border`}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value as Gender);
                    genitive(person, e.target.value as Gender).then(setPersonGen);
                  }}
                >
                  <option value="male">мужской</option>
                  <option value="female">женский</option>
                </select>
              </Label>
              {kind === "ooo" && (
                <>
                  <Label t="Должность">
                    <select className={`${field} w-full border`} value={position} onChange={(e) => setPosition(e.target.value as typeof position)}>
                      <option>Генеральный директор</option>
                      <option>Директор</option>
                    </select>
                  </Label>
                  <Label t="ФИО в родительном падеже" hint="Подставлено автоматически: проверьте («в лице генерального директора …»)">
                    <Input className={field} value={personGen} onChange={(e) => setPersonGen(e.target.value)} />
                  </Label>
                  <Label t="Действует на основании">
                    <select className={`${field} w-full border`} value={basis} onChange={(e) => setBasis(e.target.value as typeof basis)}>
                      <option>Устав</option>
                      <option>Доверенность</option>
                    </select>
                  </Label>
                  {basis === "Доверенность" && (
                    <Label t="Номер и дата доверенности" hint="Например: № 12 от 01.09.2026">
                      <Input className={field} value={proxy} onChange={(e) => setProxy(e.target.value)} />
                    </Label>
                  )}
                </>
              )}
              <div className="rounded-xl bg-cream/5 p-4 text-[max(12px,0.86em)] leading-relaxed text-cream-muted md:col-span-2">
                <b className="text-cream">Так будет в договоре:</b> {preview}
              </div>
            </Card>

            <Card n={4} t="Банковские реквизиты">
              <Label t="Банк" wide>
                <Input className={field} value={bank} onChange={(e) => setBank(e.target.value)} />
              </Label>
              <Label t="Расчётный счёт">
                <Input className={field} inputMode="numeric" value={rs} onChange={(e) => setRs(digits(e.target.value).slice(0, 20))} />
              </Label>
              <Label t="БИК">
                <Input className={field} inputMode="numeric" value={bik} onChange={(e) => setBik(digits(e.target.value).slice(0, 9))} />
              </Label>
              <Label t="Корреспондентский счёт" wide>
                <Input className={field} inputMode="numeric" value={ks} onChange={(e) => setKs(digits(e.target.value).slice(0, 20))} />
              </Label>
            </Card>

            <Card n={5} t="Контакты заказчика">
              <Label t="Телефон">
                <Input className={field} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Label>
              <Label t="Электронная почта" hint="Сюда по договору идут юридически значимые сообщения">
                <Input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Label>
              <Label t="Оператор ЭДО">
                <select className={`${field} w-full border`} value={edo} onChange={(e) => setEdo(e.target.value)}>
                  {EDO.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Label>
              <Label t="ID ЭДО">
                <Input className={field} value={edoId} disabled={edo === "Нет ЭДО"} onChange={(e) => setEdoId(e.target.value)} />
              </Label>
              <Label t="Ответственное контактное лицо" hint="ФИО и должность; пусто = руководитель" wide>
                <Input className={field} value={contact} onChange={(e) => setContact(e.target.value)} />
              </Label>
            </Card>

            <Card n={6} t="Точки ресторана">
              <div className="space-y-3 md:col-span-2">
                {points.map((p, i) => (
                  <div key={i} className="grid gap-2 rounded-xl bg-cream/5 p-3 md:grid-cols-[1fr_1.3fr_0.8fr_auto]">
                    <Input className={field} placeholder="Название на сервисе" value={p.title} onChange={(e) => setPoint(i, "title", e.target.value)} />
                    <Input className={field} placeholder="Адрес" value={p.address} onChange={(e) => setPoint(i, "address", e.target.value)} />
                    <Input className={field} placeholder="Город" value={p.city} onChange={(e) => setPoint(i, "city", e.target.value)} />
                    <button
                      type="button"
                      onClick={() => setPoints((ps) => (ps.length > 1 ? ps.filter((_, j) => j !== i) : ps))}
                      className="flex h-12 items-center justify-center rounded-xl px-3 text-cream-muted hover:text-cream disabled:opacity-30"
                      disabled={points.length === 1}
                      aria-label="Убрать точку"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPoints((ps) => [...ps, { title: "", address: "", city: ps[ps.length - 1]?.city || "" }])}
                  className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-4 py-2.5 font-medium"
                >
                  <Icon name="Plus" size={16} /> добавить точку
                </button>
              </div>
            </Card>

            <Card n={7} t="Стоимость и даты">
              <Label t="Стоимость за одну точку в месяц, ₽">
                <Input className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(digits(e.target.value))} />
              </Label>
              <Label t="Номер договора">
                <Input className={field} value={num} onChange={(e) => setNum(e.target.value)} />
              </Label>
              {dupe && <p className="text-[max(12px,0.86em)] text-brand md:col-span-2">{dupe}</p>}
              <Label t="Дата договора" hint="Выберите в календаре">
                <Input className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Label>
              <Label t="Первый месяц работ" hint="Подставляется в образцы счёта и закрывающих в приложениях">
                <Input className={field} type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              </Label>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[24px] bg-pale p-6 text-foreground md:p-8">
              <p className="text-[0.9em] text-foreground/70">{clientTitle.trim().length > 6 ? clientTitle : "Заказчик не заполнен"}</p>
              <p className="mt-4 text-[0.9em] text-foreground/70">
                {pointsN} {plural(pointsN, "точка", "точки", "точек")} × {money(priceNum)} ₽
              </p>
              <p className="mt-1 font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em]">{money(total)} ₽</p>
              <p className="mt-2 text-[0.9em] text-foreground/70">в месяц, {numberWords(total)} рублей</p>
              <button
                onClick={generate}
                disabled={busy}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-medium text-brand disabled:opacity-60"
              >
                {busy ? <Icon name="Loader2" size={20} className="animate-spin" /> : <>сформировать договор <Icon name="ArrowRight" size={18} /></>}
              </button>
              {errors.length > 0 && (
                <div className="mt-4 rounded-xl bg-foreground/10 p-4 text-[max(12px,0.86em)]">
                  <b>Проверьте поля:</b>
                  <ul className="mt-1 list-disc pl-5">
                    {errors.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {msg && <p className="mt-4 text-[max(12px,0.86em)]">{msg}</p>}
              {result && (
                <div className="mt-4 grid gap-2">
                  <button onClick={() => downloadWord()} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand font-medium">
                    <Icon name="FileText" size={18} /> скачать Word
                  </button>
                  <button onClick={() => printPdf()} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-foreground/30 font-medium">
                    <Icon name="FileDown" size={18} /> сохранить PDF
                  </button>
                  <p className="text-[max(12px,0.78em)] text-foreground/60">
                    Для PDF откроется окно печати: выберите «Сохранить как PDF».
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[24px] bg-surface p-6 text-cream">
              <h2 className="font-display text-[1.2em] font-semibold">журнал договоров</h2>
              <p className="mt-1 text-[max(12px,0.8em)] text-cream-muted">Нашли ошибку: «заполнить из этого», поправьте и сформируйте снова. Сохранится новая версия.</p>
              {journal.length === 0 ? (
                <p className="mt-3 text-[0.9em] text-cream-muted">Пока пусто.</p>
              ) : (
                <ul className="mt-3 space-y-3 text-[0.9em]">
                  {journal.map((j, i) => (
                    <li key={i} className="border-t border-cream/15 pt-3">
                      <b>№ {j.num}</b>
                      {j.version && j.version > 1 ? <span className="text-brand"> · версия {j.version}</span> : null} · {j.client}
                      <span className="block text-cream-muted">
                        {j.points} {plural(j.points, "точка", "точки", "точек")}, {money(j.total)} ₽ в месяц · {j.created}
                        {j.executor ? ` · ${j.executor.replace("ИП ", "")}` : ""}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {j.has_form && (
                          <button
                            onClick={() => fillFrom(j.id)}
                            disabled={histBusy === j.id}
                            className="rounded-lg bg-brand px-3 py-1.5 text-[0.85em] font-medium text-foreground disabled:opacity-60"
                          >
                            заполнить из этого
                          </button>
                        )}
                        <button
                          onClick={() => fileFrom(j.id, j.num).then((r) => downloadWord(r)).catch((e) => setMsg(`Ошибка: ${e.message}`))}
                          className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.85em]"
                        >
                          Word
                        </button>
                        <button
                          onClick={() => fileFrom(j.id, j.num).then((r) => printPdf(r)).catch((e) => setMsg(`Ошибка: ${e.message}`))}
                          className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.85em]"
                        >
                          PDF
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Docs;
