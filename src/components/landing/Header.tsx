import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";

export const USEFUL_LINKS = [
  { href: "/kalkulyatory", label: "калькуляторы", icon: "Calculator" },
  { href: "/sravnenie-agregatorov", label: "сравнение игроков", icon: "GitCompare" },
  { href: "/razbor-otchetov", label: "разбор отчётов", icon: "FileSearch" },
  { href: "/chek-listy", label: "чек-листы", icon: "ListChecks" },
  { href: "/testy", label: "тесты", icon: "CircleHelp" },
  { href: "/slovar", label: "глоссарий", icon: "BookA" },
  { href: "/pochitat", label: "почитать", icon: "BookOpen" },
];

export const NAV = [
  { href: "/uslugi", label: "услуги" },
  { href: "/goroda", label: "города" },
  { href: "/blog", label: "блог" },
  { href: "/partnery", label: "партнёры" },
  { href: "#results", label: "кейсы" },
  { href: "#pricing", label: "стоимость" },
  { href: "#free-audit", label: "бесплатный анализ" },
  { href: "#team", label: "кто мы" },
  { href: "#contacts", label: "контакты" },
];

const MOBILE_NAV = [
  { href: "/uslugi", label: "услуги" },
  { href: "/goroda", label: "города" },
  { href: "/blog", label: "блог" },
  { href: "#results", label: "кейсы" },
  { href: "#free-audit", label: "бесплатный анализ" },
  { href: "#pricing", label: "стоимость" },
  { href: "#contacts", label: "контакты" },
];

const MESSENGERS = [
  { icon: "Send", label: "telegram", href: "https://t.me/sitnikovy1" },
  { icon: "MessageCircle", label: "whatsapp", href: "https://wa.me/79310028222" },
  { icon: "MessagesSquare", label: "max", href: "https://max.ru/u/79310028222" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const home = pathname === "/" ? "" : "/";
  const to = (href: string) => (href.startsWith("#") ? `${home}${href}` : href);
  const usefulActive = USEFUL_LINKS.some((l) => pathname.startsWith(l.href));

  return (
    <header className="relative z-20 flex items-center justify-between gap-3 md:gap-4 px-5 pt-4 md:px-14 md:pt-[22px]">
      <a
        href={to("#top")}
        className="flex items-baseline gap-[2px] font-display text-[1.15em] font-semibold md:text-[1.3em] tracking-[-0.02em]"
      >
        agregatory<span className="font-normal text-muted-foreground">.pro</span>
      </a>

      <nav
        aria-label="Разделы"
        className="hidden items-center gap-3 md:gap-4 whitespace-nowrap text-[0.88em] xl:flex 2xl:gap-5 2xl:text-[0.9em]"
      >
        <div className="group relative">
          <button
            type="button"
            aria-haspopup="true"
            className={`inline-flex items-center gap-1 transition-opacity hover:opacity-100 ${
              usefulActive ? "opacity-100" : "opacity-[.85]"
            }`}
          >
            полезное
            <Icon
              name="ChevronDown"
              size={14}
              className="transition-transform group-hover:rotate-180"
            />
          </button>
          <div className="invisible absolute left-0 top-full z-30 w-[210px] pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-xl">
              {USEFUL_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 border-b border-foreground/8 px-4 py-3.5 text-[0.95em] transition-colors last:border-b-0 hover:bg-foreground hover:text-brand"
                >
                  <Icon name={l.icon} size={16} />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {NAV.map((n) => (
          <a
            key={n.href}
            href={to(n.href)}
            className="opacity-[.85] transition-opacity hover:opacity-100"
          >
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
          href={to("#lead")}
          className="hidden items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[22px] py-3 text-[0.94em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          консультация
        </a>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Открыть меню"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 xl:hidden"
            >
              <Icon name="Menu" size={20} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-[88vw] max-w-[380px] flex-col gap-0 overflow-y-auto border-l border-border bg-background px-5 pb-5 pt-5 max-[360px]:px-4 max-[360px]:pb-3 max-[360px]:pt-4"
          >
            <SheetTitle className="font-display text-lg font-semibold">
              agregatory<span className="font-normal text-muted-foreground">.pro</span>
            </SheetTitle>
            {/* Полезное — первым блоком, плиткой в две колонки, чтобы всё меню помещалось на один экран */}
            <p className="pb-2 pt-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground max-[360px]:pb-1.5 max-[360px]:pt-3">
              полезное
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {USEFUL_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[40px] items-center gap-2 rounded-xl bg-foreground/[.06] px-2.5 py-2 text-[13px] font-medium leading-tight last:odd:col-span-2 max-[360px]:min-h-[36px] max-[360px]:px-2 max-[360px]:py-1.5"
                >
                  <Icon name={l.icon} size={16} className="shrink-0" />
                  {l.label}
                </a>
              ))}
            </div>
            <p className="pb-2 pt-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground max-[360px]:pb-1.5 max-[360px]:pt-3">
              разделы
            </p>
            <nav className="grid grid-cols-2 gap-1.5">
              {MOBILE_NAV.map((n) => (
                <a
                  key={n.href}
                  href={to(n.href)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[40px] items-center justify-center rounded-xl border border-foreground/15 px-2.5 py-2 text-center font-display text-[14px] font-semibold leading-tight tracking-tight last:odd:col-span-2 max-[360px]:min-h-[36px] max-[360px]:py-1.5"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 max-[360px]:pt-2">
              <a
                href={to("#lead")}
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground max-[360px]:py-2.5"
              >
                оставить заявку
              </a>
              <div className="mt-1.5 flex gap-1.5">
                {MESSENGERS.map((m) => (
                  <a
                    key={m.label}
                    href={m.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={m.label}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/30 text-[13px] font-medium max-[360px]:h-9 max-[360px]:gap-1 max-[360px]:text-[12px]"
                  >
                    <Icon name={m.icon} size={16} />
                    {m.label}
                  </a>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;