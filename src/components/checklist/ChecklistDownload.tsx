import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { reachGoal } from "@/lib/metrika";
import type { ChecklistPage } from "@/data/checklists";

const LEAD_URL = "https://functions.poehali.dev/3df83e5c-d49d-4a84-8862-107cedfd17f0";
const UNLOCK_KEY = "checklist-unlocked";

type Errors = Partial<Record<"name" | "phone", string>>;

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

const printChecklist = () => {
  document.body.classList.add("printing-checklist");
  const cleanup = () => {
    document.body.classList.remove("printing-checklist");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
  setTimeout(cleanup, 1500);
};

const ChecklistDownload = ({ page }: { page: ChecklistPage }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);

  const validate = () => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Как к вам обращаться?";
    if (phone.replace(/\D/g, "").length !== 11) e.phone = "Введите номер полностью";
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
        body: JSON.stringify({
          name,
          phone,
          place: "",
          status: "скачал чек-лист",
          channel: "Telegram",
          comment: `Чек-лист: ${page.navLabel} (/chek-listy/${page.slug})`,
          page: window.location.href,
        }),
      });
      if (!res.ok) throw new Error("failed");
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        /* приватный режим */
      }
      setUnlocked(true);
      setOpen(false);
      reachGoal("checklist_download", { slug: page.slug });
      toast({
        title: "Чек-лист открыт",
        description: "Сейчас откроется окно печати — сохраните файл в PDF.",
      });
      setTimeout(printChecklist, 400);
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

  if (unlocked) {
    return (
      <button
        type="button"
        onClick={() => {
          reachGoal("checklist_print", { slug: page.slug });
          printChecklist();
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[0.88em] font-medium text-cream transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
      >
        <Icon name="Download" size={15} />
        скачать чек-лист в PDF
      </button>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          reachGoal("checklist_download_open", { slug: page.slug });
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[0.88em] font-medium text-cream transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
      >
        <Icon name="Download" size={15} />
        скачать чек-лист в PDF
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-cream/20 bg-cream/[0.04] p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <p className="font-display text-[1.05em] font-semibold text-cream">
            Куда отправить ссылку на чек-лист
          </p>
          <p className="mt-1 text-[0.86em] leading-snug text-cream-muted">
            Оставьте контакт — откроем скачивание и пришлём разбор вашего заведения, если захотите.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="shrink-0 text-cream-muted transition-colors hover:text-cream"
        >
          <Icon name="X" size={18} />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            aria-label="Ваше имя"
            className="h-12 border-cream/25 bg-transparent text-cream placeholder:text-cream-muted"
          />
          {errors.name && <p className="mt-1 text-[0.8em] text-red-300">{errors.name}</p>}
        </div>
        <div>
          <Input
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            aria-label="Телефон"
            className="h-12 border-cream/25 bg-transparent text-cream placeholder:text-cream-muted"
          />
          {errors.phone && <p className="mt-1 text-[0.8em] text-red-300">{errors.phone}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "отправляем..." : "получить чек-лист"}
        <Icon name="Download" size={17} />
      </button>

      <p className="mt-3 text-[0.78em] leading-snug text-cream-muted">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Мы не рассылаем спам.
      </p>
    </form>
  );
};

export default ChecklistDownload;