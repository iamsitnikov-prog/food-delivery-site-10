import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";

export const NAV = [
  { href: "#steps", label: "как работаем" },
  { href: "#services", label: "услуги" },
  { href: "#results", label: "результаты" },
  { href: "#faq", label: "вопросы" },
  { href: "#contacts", label: "контакты" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 pt-[22px] md:px-14">
      <a href="#top" className="flex items-baseline gap-[2px] font-display text-[1.3em] font-semibold tracking-[-0.02em]">
        agregatory<span className="font-normal text-muted-foreground">.pro</span>
      </a>

      <nav aria-label="Разделы" className="hidden gap-7 text-[0.94em] lg:flex">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="opacity-[.85] transition-opacity hover:opacity-100">
            {n.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 lg:hidden"
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
