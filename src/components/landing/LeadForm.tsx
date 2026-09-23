import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import useReveal from "@/hooks/use-reveal";
import { reachGoal } from "@/lib/metrika";
import { ROBOT } from "./Hero";

const STATUSES = [
  "бесплатный анализ",
  "тариф для действующих",
  "тариф для новичков",
  "консультация",
  "аудит",
  "курс по работе с агрегатором",
  "другое",
];

const CHANNELS = ["Телефон", "Telegram", "WhatsApp", "MAX"];

const LEAD_URL = "https://functions.poehali.dev/3df83e5c-d49d-4a84-8862-107cedfd17f0";

type Errors = Partial<Record<"name" | "phone" | "agree", string>>;

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

const LeadForm = () => {
  const ref = useReveal<HTMLElement>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Как к вам обращаться?";
    if (phone.replace(/\D/g, "").length !== 11) e.phone = "Введите номер полностью";
    if (!agree) e.agree = "Нужно согласие на обработку данных";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, place, status, channel, comment }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
      reachGoal("lead_submit", { status, channel });
      toast({ title: "Заявка отправлена", description: "Перезвоним в течение рабочего дня." });
    } catch {
      reachGoal("lead_error");
      toast({
        title: "Не удалось отправить",
        description: "Позвоните нам: +7 931 002-82-22",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setName("");
    setPhone("");
    setPlace("");
    setComment("");
    setStatus(STATUSES[0]);
    setChannel(CHANNELS[0]);
    setErrors({});
    setSent(false);
  };

  const field =
    "h-14 rounded-xl border-cream/20 bg-cream/5 px-4 text-[1em] text-cream placeholder:text-cream-muted/70 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0";

  return (
    <section id="lead" ref={ref} className="relative scroll-mt-4 overflow-hidden px-5 py-20 md:px-14 md:pb-0 md:pt-28">
      <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="reveal relative pb-20 md:pb-0">
          <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[80px]">
            оставьте
            <span className="block pl-[1.2em]">заявку</span>
          </h2>
          <p className="mt-6 max-w-[420px] text-[1.15em] leading-[1.25]">
            Заполните поля и&nbsp;выберите услугу. Увеличьте свою выручку уже&nbsp;в&nbsp;первую неделю.
          </p>
          <ul className="mt-8 space-y-3">
            {["свяжемся в течение рабочего дня", "разберём вашу ситуацию на созвоне", "владеете сетью — индивидуальные условия"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon name="Check" size={16} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <img
            src={ROBOT}
            alt=""
            aria-hidden
            width={1100}
            height={1052}
            loading="lazy"
            decoding="async"
            className="pointer-events-none mt-6 hidden w-[360px] animate-float lg:block"
          />
        </div>

        <div className="reveal rounded-[28px] bg-surface p-6 text-cream md:mb-16 md:p-10">
          {sent ? (
            <div className="flex min-h-[420px] animate-scale-in flex-col items-start justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand text-foreground">
                <Icon name="PartyPopper" size={30} />
              </span>
              <h3 className="mt-6 font-display text-[2.2em] font-semibold leading-none tracking-[-0.02em]">
                спасибо, {name.trim().split(" ")[0]}!
              </h3>
              <p className="mt-4 max-w-[380px] text-cream-muted">
                Заявка у&nbsp;нас. Свяжемся с&nbsp;вами по&nbsp;номеру {phone} в&nbsp;течение рабочего дня.
              </p>
              <button onClick={reset} className="mt-8 rounded-xl border border-cream/30 px-5 py-3 font-medium transition-colors hover:bg-brand hover:text-foreground">
                отправить ещё одну
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div>
                <Input
                  className={`${field} ${errors.name ? "border-destructive" : ""}`}
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1.5 text-[0.82em] text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Input
                  className={`${field} ${errors.phone ? "border-destructive" : ""}`}
                  placeholder="+7 (___) ___-__-__"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value ? formatPhone(e.target.value) : "")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1.5 text-[0.82em] text-destructive">{errors.phone}</p>}
              </div>
              <Input
                className={field}
                placeholder="Название заведения и город"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />

              <div>
                <p className="mb-2 text-[0.86em] text-cream-muted">Выберите услугу</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`rounded-full border px-4 py-2 text-[0.88em] transition-colors ${
                        status === s
                          ? "border-brand bg-brand text-foreground"
                          : "border-cream/20 text-cream-muted hover:border-brand hover:text-cream"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[0.86em] text-cream-muted">Как с вами связаться?</p>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setChannel(c)}
                      className={`rounded-full border px-4 py-2 text-[0.88em] transition-colors ${
                        channel === c
                          ? "border-brand bg-brand text-foreground"
                          : "border-cream/20 text-cream-muted hover:border-brand hover:text-cream"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                className="min-h-[110px] rounded-xl border-cream/20 bg-cream/5 px-4 py-3 text-[1em] text-cream placeholder:text-cream-muted/70 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0"
                placeholder="Комментарий (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <label className="flex cursor-pointer items-start gap-3 text-[0.86em] leading-snug">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(v === true)}
                  className="mt-0.5 border-cream/40 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-foreground"
                />
                <span>
                  Согласен на обработку персональных данных и&nbsp;с&nbsp;
                  <Link to="/privacy" target="_blank" className="text-brand underline underline-offset-2">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.agree && <p className="text-[0.82em] text-destructive">{errors.agree}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[1.06em] font-medium text-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {loading ? <Icon name="Loader2" size={20} className="animate-spin" /> : "оставить заявку"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadForm;