import Icon from "@/components/ui/icon";
import { NAV } from "./Header";

const CONTACTS = [
  { icon: "Phone", label: "телефон", value: "+7 (900) 000-00-00", href: "tel:+79000000000" },
  { icon: "Mail", label: "почта", value: "hello@agregatory.pro", href: "mailto:hello@agregatory.pro" },
  { icon: "Send", label: "телеграм", value: "@agregatory_pro", href: "https://t.me/agregatory_pro" },
];

const Contacts = () => {
  return (
    <footer id="contacts" className="scroll-mt-4 rounded-t-[40px] bg-surface px-5 pb-8 pt-16 text-cream md:px-14 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
            на&nbsp;связи
            <span className="block pl-[1.2em] text-brand">каждый день</span>
          </h2>
          <p className="mt-6 max-w-[380px] text-cream-muted">
            Ежедневно с&nbsp;9:00 до&nbsp;21:00 по&nbsp;Москве. Работаем с&nbsp;ресторанами по&nbsp;всей России.
          </p>
          <a
            href="#lead"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            оставить заявку <Icon name="ArrowRight" size={18} />
          </a>
        </div>

        <ul className="border-t border-cream/25">
          {CONTACTS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-cream/25 py-6"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cream/25 text-brand transition-colors group-hover:bg-brand group-hover:text-foreground">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span>
                    <span className="block text-[0.82em] text-cream-muted">{c.label}</span>
                    <span className="font-display text-[1.25em] font-semibold tracking-[-0.01em] md:text-[1.45em]">{c.value}</span>
                  </span>
                </span>
                <Icon name="ArrowUpRight" size={22} className="text-cream-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 flex flex-col gap-6 border-t border-cream/25 pt-6 text-[0.86em] text-cream-muted md:flex-row md:items-center md:justify-between">
        <a href="#top" className="font-display text-[1.3em] font-semibold text-cream">
          agregatory<span className="font-normal text-cream-muted">.pro</span>
        </a>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-cream">
              {n.label}
            </a>
          ))}
        </nav>
        <span>© {new Date().getFullYear()} agregatory.pro</span>
      </div>
    </footer>
  );
};

export default Contacts;
