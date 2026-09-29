import { Link, useLocation } from "react-router-dom";
import { CITY_PAGES } from "@/data/seo-cities";
import { SERVICE_PAGES } from "@/data/seo-services";
import Icon from "@/components/ui/icon";
import { NAV, USEFUL_LINKS } from "./Header";

const CONTACTS = [
  { icon: "Phone", label: "телефон", value: "+7 931 002-82-22", href: "tel:+79310028222" },
  { icon: "Send", label: "телеграм", value: "@sitnikovy1", href: "https://t.me/sitnikovy1" },
];

const MESSENGERS = [
  { icon: "MessageCircle", label: "whatsapp", href: "https://wa.me/79310028222" },
  { icon: "MessagesSquare", label: "max", href: "https://max.ru/u/79310028222" },
];

const Contacts = () => {
  const { pathname } = useLocation();
  const home = pathname === "/" ? "" : "/";
  const to = (href: string) => (href.startsWith("#") ? `${home}${href}` : href);

  return (
    <footer id="contacts" className="scroll-mt-4 rounded-t-[40px] bg-surface px-5 pb-8 pt-16 text-cream md:px-14 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-[34px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
            на&nbsp;связи
            <span className="block pl-[1.2em] text-brand">каждый день</span>
          </h2>
          <p className="mt-6 max-w-[380px] text-cream-muted">
            Увеличьте свою выручку уже&nbsp;в&nbsp;первую неделю — просто оставьте заявку. Работаем с&nbsp;ресторанами по&nbsp;всей России.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={to("#lead")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              начать сотрудничать <Icon name="ArrowRight" size={18} />
            </a>
            <Link
              to="/razbor-otchetov"
              className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-7 py-4 font-medium transition-colors hover:border-cream/60"
            >
              <Icon name="FileSearch" size={18} />
              разобрать отчёт
            </Link>
          </div>
          <p className="mt-6 max-w-[380px] text-[0.86em] text-cream-muted">
            Владеете сетью? Для&nbsp;вас индивидуальные условия.
          </p>
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
          <li className="flex flex-wrap items-center gap-3 border-b border-cream/25 py-6">
            <span className="mr-auto text-[0.82em] text-cream-muted">мессенджеры</span>
            {MESSENGERS.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-3 font-medium transition-colors hover:bg-brand hover:text-foreground"
              >
                <Icon name={m.icon} size={18} />
                {m.label}
              </a>
            ))}
          </li>
        </ul>
      </div>

      <div className="mt-14 grid gap-8 border-t border-cream/25 pt-8 md:grid-cols-2">
        <nav aria-label="Услуги">
          <h2 className="text-[0.82em] uppercase tracking-wide text-cream-muted">услуги</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.86em]">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link to={`/uslugi/${s.slug}`} className="text-cream-muted hover:text-cream">
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Города">
          <h2 className="text-[0.82em] uppercase tracking-wide text-cream-muted">города</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.86em]">
            {CITY_PAGES.map((c) => (
              <li key={c.slug}>
                <Link to={`/goroda/${c.slug}`} className="text-cream-muted hover:text-cream">
                  {c.navLabel}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.82em] text-cream-muted/80">Работаем по всей России.</p>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-cream/25 pt-6 text-[0.86em] text-cream-muted md:flex-row md:items-center md:justify-between">
        <a href={to("#top")} className="font-display text-[1.3em] font-semibold text-cream">
          agregatory<span className="font-normal text-cream-muted">.pro</span>
        </a>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {USEFUL_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-cream">
              {l.label}
            </a>
          ))}
          {NAV.map((n) => (
            <a key={n.href} href={to(n.href)} className="hover:text-cream">
              {n.label}
            </a>
          ))}
          <Link to="/privacy" className="hover:text-cream">
            политика конфиденциальности
          </Link>
        </nav>
        <span>© {new Date().getFullYear()} agregatory.pro</span>
      </div>

      <div className="mt-6 space-y-2 text-[0.78em] leading-relaxed text-cream-muted/80">
        <p>ИП Ситников Юрий Сергеевич, ИНН 632509481120 · ИП Ковальчук Лилия Максимовна, ИНН 681601399981</p>
        <p>
          При создании сайта все партнёры дали согласие на размещение и публикацию персональных и коммерческих данных.
        </p>
      </div>
    </footer>
  );
};

export default Contacts;