import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";

export const NAV = [
  { href: "#services", label: "услуги" },
  { href: "#advantages", label: "преимущества" },
  { href: "#guarantees", label: "гарантии" },
  { href: "#results", label: "результаты" },
  { href: "#pricing", label: "стоимость" },
  { href: "#extra", label: "дополнительно" },
  { href: "#free-audit", label: "бесплатный анализ" },
  { href: "#team", label: "кто мы" },
  { href: "#reviews", label: "отзывы" },
  { href: "#contacts", label: "контакты" },
];

const MESSENGERS = [
  { icon: "Send", label: "telegram", href: "https://t.me/sitnikovy1" },
  { icon: "MessageCircle", label: "whatsapp", href: "https://wa.me/79310028222" },
  { icon: "MessagesSquare", label: "max", href: "https://max.ru/u/79310028222" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 pt-[22px] md:px-14">
      <a href="#top" className="flex items-baseline gap-[2px] font-display text-[1.3em] font-semibold tracking-[-0.02em]">
        agregatory<span className="font-normal text-muted-foreground">.pro</span>
      </a>

      <nav aria-label="Разделы" className="hidden gap-5 text-[0.9em] xl:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="opacity-[.85] transition-opacity hover:opacity-100">
            {n.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 xl:flex">
          {MESSENGERS.map((m) => (
            <a
              key={m.label}
              href={m.href}
              target="_blank"
              rel="noreferrer"
              aria-label={m.label}
              title={m.label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Icon name={m.icon} size={19} />
            </a>
          ))}
        </div>

        <a
          href="#lead"
          className="hidden items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[22px] py-3 text-[0.94em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          консультация
        </a>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Открыть меню"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 xl:hidden"
            >
              <Icon name="Menu" size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-border bg-background">
            <SheetTitle className="font-display text-2xl font-semibold">
              agregatory<span className="font-normal text-muted-foreground">.pro</span>
            </SheetTitle>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 font-display text-2xl font-semibold tracking-tight"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="#lead"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 font-medium text-primary-foreground"
            >
              оставить заявку
            </a>
            <div className="mt-4 flex gap-2">
              {MESSENGERS.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={m.label}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-primary/30"
                >
                  <Icon name={m.icon} size={20} />
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;