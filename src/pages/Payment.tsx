import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import usePayEnabled from "@/hooks/use-pay-enabled";
import { reachGoal } from "@/lib/metrika";
import { PAY_PRODUCTS, SELLER_INN, SELLER_OGRNIP, formatRub, type PayProduct } from "@/data/payments";

type Errors = Partial<Record<"name" | "phone" | "email" | "amount" | "invoice" | "agree" | "form", string>>;

const formatPhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += " " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
};

const Payment = () => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const enabled = usePayEnabled();

  useSeo({
    title: "Оплата услуг онлайн картой и СБП | agregatory.pro",
    description:
      "Оплатите консультацию, аудит ресторана на агрегаторе или курс для команды банковской картой или через СБП. Чек придёт на почту, свяжемся в течение рабочего дня.",
    path: pathname,
  });

  const initial = PAY_PRODUCTS.find((p) => p.code === params.get("usluga"))?.code ?? PAY_PRODUCTS[0].code;
  const [code, setCode] = useState<PayProduct["code"]>(initial);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState("");
  const [agree, setAgree] = useState(false);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const product = PAY_PRODUCTS.find((p) => p.code === code)!;
  const custom = product.price === 0;
  const amountNum = Number(amount.replace(/\s/g, "").replace(",", "."));
  const total = custom ? (Number.isFinite(amountNum) ? amountNum : 0) : product.price;

  const validate = () => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Как к вам обращаться?";
    if (phone.replace(/\D/g, "").length !== 11) e.phone = "Введите номер полностью";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "На эту почту придёт чек";
    if (custom) {
      if (!(amountNum >= 1000 && amountNum <= 1000000)) e.amount = "Сумма от 1 000 до 1 000 000 ₽";
      if (invoice.trim().length < 1) e.invoice = "Номер счёта, договора или КП";
    }
    if (!agree) e.agree = "Нужно согласие с офертой";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/pay.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: trap,
          product: code,
          name,
          phone,
          email: email.trim(),
          amount: custom ? amountNum : undefined,
          invoice: custom ? invoice : undefined,
          agree,
          page: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "failed");
      reachGoal("pay_start", { product: code, amount: total });
      window.location.href = data.url;
    } catch (err) {
      reachGoal("pay_error", { product: code });
      const msg = err instanceof Error && err.message !== "failed" ? err.message : "";
      setErrors({ form: msg || "Не получилось перейти к оплате. Попробуйте ещё раз или позвоните: +7 931 002-82-22" });
      setLoading(false);
    }
  };

  const field =
    "h-14 rounded-xl border-cream/20 bg-cream/5 px-4 text-[1em] text-cream placeholder:text-cream-muted/70 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0";
  const err = (k: keyof Errors) =>
    errors[k] ? <p className="mt-1.5 text-[max(12px,0.82em)] text-destructive">{errors[k]}</p> : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-5 py-10 md:px-14 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 font-medium text-cream transition-transform hover:-translate-y-0.5"
        >
          <Icon name="ArrowLeft" size={18} />
          на главную
        </Link>

        <h1 className="mt-10 max-w-[900px] font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[64px]">
          оплата услуг
          <span className="block text-muted-foreground">картой или через СБП</span>
        </h1>
        <p className="mt-6 max-w-[620px] text-[1.05em] leading-snug">
          Онлайн оплата для физических лиц. Выберите услугу и&nbsp;заполните данные: оплата проходит на&nbsp;защищённой
          странице ЮKassa, чек придёт на&nbsp;почту. После оплаты свяжемся с&nbsp;вами в&nbsp;течение рабочего дня.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <div className="grid content-start gap-3" role="radiogroup" aria-label="Услуга">
            {PAY_PRODUCTS.map((p) => {
              const active = p.code === code;
              return (
                <button
                  key={p.code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCode(p.code)}
                  className={`flex items-start gap-4 rounded-[24px] p-5 text-left transition-colors md:p-6 ${
                    active ? "bg-surface text-cream ring-2 ring-surface" : "bg-pale text-foreground hover:bg-pale/70"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      active ? "bg-brand text-foreground" : "bg-foreground/10"
                    }`}
                  >
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <b className="font-display text-[1.25em] font-semibold tracking-[-0.02em]">{p.short}</b>
                      <span className="font-display text-[1.25em] font-semibold">
                        {p.price ? formatRub(p.price) : "своя сумма"}
                      </span>
                    </span>
                    <span className={`mt-1 block text-[0.92em] leading-snug ${active ? "text-cream-muted" : "text-foreground/75"}`}>{p.note}</span>
                  </span>
                </button>
              );
            })}
            <div className="flex flex-col items-start gap-4 rounded-[24px] border-2 border-foreground/15 p-5 md:p-6">
              <span className="flex items-center gap-3 font-display text-[1.15em] font-semibold tracking-[-0.02em]">
                <Icon name="Building2" size={20} />
                оплата для ресторанов и&nbsp;компаний
              </span>
              <p className="text-[0.95em] leading-snug text-foreground/75">
                Онлайн оплата на&nbsp;сайте только для физических лиц. Ресторанам, ИП и&nbsp;компаниям выставим счёт
                и&nbsp;пришлём договор: оплата на&nbsp;расчётный счёт, с&nbsp;закрывающими документами.
              </p>
              <Link
                to="/#lead"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-medium text-brand transition-transform hover:-translate-y-0.5"
              >
                запросить счёт <Icon name="ArrowRight" size={18} />
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-surface p-5 text-cream md:p-10">
            {enabled === false ? (
              <div className="flex min-h-[360px] flex-col items-start justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand text-foreground">
                  <Icon name="Clock" size={26} />
                </span>
                <h2 className="mt-6 font-display text-[1.9em] font-semibold leading-none tracking-[-0.02em]">
                  онлайн оплата скоро заработает
                </h2>
                <p className="mt-4 max-w-[420px] text-cream-muted">
                  Пока оставьте заявку или напишите нам: пришлём счёт и&nbsp;договоримся о&nbsp;времени.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/#lead" className="rounded-xl bg-brand px-6 py-4 font-medium text-foreground">
                    оставить заявку
                  </Link>
                  <a href="https://t.me/sitnikovy1" className="rounded-xl border border-cream/30 px-6 py-4 font-medium">
                    написать в Telegram
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <p className="text-cream-muted">{product.title}</p>
                {custom && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        className={`${field} ${errors.amount ? "border-destructive" : ""}`}
                        placeholder="Сумма, ₽"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^\d\s,.]/g, ""))}
                        aria-label="Сумма к оплате"
                      />
                      {err("amount")}
                    </div>
                    <div>
                      <Input
                        className={`${field} ${errors.invoice ? "border-destructive" : ""}`}
                        placeholder="Номер счёта или договора"
                        value={invoice}
                        onChange={(e) => setInvoice(e.target.value)}
                        aria-label="Номер счёта или договора"
                      />
                      {err("invoice")}
                    </div>
                  </div>
                )}
                <div>
                  <Input
                    className={`${field} ${errors.name ? "border-destructive" : ""}`}
                    placeholder="Ваше имя"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Ваше имя"
                  />
                  {err("name")}
                </div>
                <div>
                  <Input
                    className={`${field} ${errors.phone ? "border-destructive" : ""}`}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value ? formatPhone(e.target.value) : "")}
                    aria-label="Телефон"
                  />
                  {err("phone")}
                </div>
                <div>
                  <Input
                    className={`${field} ${errors.email ? "border-destructive" : ""}`}
                    placeholder="Почта для чека"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Почта для чека"
                  />
                  {err("email")}
                </div>

                <label htmlFor="pay-agree" className="flex cursor-pointer items-start gap-3 pt-1 text-[max(12px,0.86em)] leading-snug text-cream-muted">
                  <Checkbox
                    id="pay-agree"
                    checked={agree}
                    onCheckedChange={(v) => setAgree(v === true)}
                    className="mt-0.5 size-5 shrink-0 border-cream/40 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-foreground"
                  />
                  <span>
                    Принимаю условия{" "}
                    <Link to="/oferta" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand underline underline-offset-2">
                      публичной оферты
                    </Link>{" "}
                    и&nbsp;согласен на&nbsp;обработку персональных данных по&nbsp;
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand underline underline-offset-2">
                      политике конфиденциальности
                    </Link>
                  </span>
                </label>
                {err("agree")}

                <button
                  type="submit"
                  disabled={loading || enabled === null}
                  className="flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[1.06em] font-medium text-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {loading || enabled === null ? (
                    <Icon name="Loader2" size={20} className="animate-spin" />
                  ) : (
                    <>
                      оплатить {total >= 1000 ? formatRub(total) : ""}
                      <Icon name="ArrowRight" size={20} />
                    </>
                  )}
                </button>
                {err("form")}
                <p className="flex items-center gap-2 text-[max(12px,0.82em)] text-cream-muted">
                  <Icon name="ShieldCheck" size={16} className="shrink-0 text-brand" />
                  Банковские карты и&nbsp;СБП. Данные карты вводятся на&nbsp;странице ЮKassa, мы их&nbsp;не&nbsp;видим.
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="mt-10 text-[max(12px,0.86em)] text-foreground/70">
          Исполнитель: ИП Ситников Юрий Сергеевич, ИНН {SELLER_INN}{SELLER_OGRNIP ? `, ОГРНИП ${SELLER_OGRNIP}` : ""} · +7 931 002-82-22 · info@agregatory.pro ·{" "}
          <Link to="/oferta" className="underline underline-offset-2">публичная оферта</Link>
        </p>
      </div>
    </main>
  );
};

export default Payment;
