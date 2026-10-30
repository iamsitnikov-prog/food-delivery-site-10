import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { PARTNER_SECTIONS, PARTNER_CITIES } from "@/data/partners";

const COUNTRIES = ["Казахстан", "Беларусь", "Узбекистан", "Армения"];
const OTHER = "другое";

const field =
  "w-full rounded-xl border border-foreground/15 bg-cream px-4 py-3 text-[0.98em] text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground/60";

const Field = ({ label, hint, required, error, children }: { label: string; hint?: string; required?: boolean; error?: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block font-medium">
      {label}
      {required && <span className="text-foreground/50"> *</span>}
    </span>
    {children}
    {hint && !error && <span className="mt-1.5 block text-[max(12px,0.85em)] text-foreground/55">{hint}</span>}
    {error && <span className="mt-1.5 block text-[max(12px,0.85em)] text-destructive">{error}</span>}
  </label>
);

const Block = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <section className="rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-8">
    <h2 className="flex items-center gap-3 font-display text-[1.3em] font-semibold tracking-[-0.02em] md:text-[1.5em]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-[0.75em] text-brand">{n}</span>
      {title}
    </h2>
    <div className="mt-5 space-y-5">{children}</div>
  </section>
);

const PartnerApply = () => {
  const { pathname, search } = useLocation();
  useSeo({
    title: "Стать партнёром agregatory.pro: анкета для сервисов и подрядчиков ресторанов",
    description:
      "Заполните анкету, и мы добавим ваш сервис в раздел партнёров agregatory.pro: фото, упаковка, автоматизация, курьеры, маркетинг и другие услуги для ресторанов.",
    path: pathname,
  });

  const presetSection = useMemo(() => {
    const id = new URLSearchParams(search).get("razdel");
    return PARTNER_SECTIONS.find((s) => s.id === id)?.title || "";
  }, [search]);

  const [section, setSection] = useState(presetSection);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("razdel");
    const t = id === "drugoe" ? OTHER : PARTNER_SECTIONS.find((s) => s.id === id)?.title || presetSection;
    if (t) setSection(t);
  }, [presetSection]);
  const [allRussia, setAllRussia] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [otherCities, setOtherCities] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) || "").trim();
    const err: Record<string, string> = {};
    if (!get("name")) err.name = "Напишите название";
    if (!get("site")) err.site = "Нужна ссылка на сайт, портфолио или соцсети";
    if (!section) err.section = "Выберите раздел";
    if (section === OTHER && !get("section_other")) err.section = "Напишите, чем вы занимаетесь";
    if (!allRussia && cities.length === 0 && !otherCities.trim() && countries.length === 0) err.geo = "Отметьте города или «вся Россия»";
    if (!get("tagline")) err.tagline = "Одна строка о том, чем вы полезны ресторану";
    if (!get("contact_name")) err.contact_name = "Как к вам обращаться";
    if (!get("contact_tg")) err.contact = "Напишите ник в Telegram или телефон, к которому привязан Telegram";
    if (!fd.get("consent")) err.consent = "Нужно согласие";
    if (logo && logo.size > 5 * 1024 * 1024) err.logo = "Файл больше 5 МБ";
    setErrors(err);
    if (Object.keys(err).length) {
      form.querySelector(`[data-err="${Object.keys(err)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const geo = [
      allRussia ? "вся Россия" : "",
      ...(allRussia ? [] : cities),
      allRussia ? "" : otherCities.trim(),
      ...countries,
    ].filter(Boolean);
    fd.set("section", section);
    fd.set("geo", geo.join(", "));
    fd.set("consent", fd.get("consent") ? "1" : "");
    if (logo) fd.set("logo", logo);
    else fd.delete("logo");
    setState("sending");
    try {
      const r = await fetch("/api/partner.php", { method: "POST", body: fd });
      setState(r.ok ? "done" : "error");
      if (r.ok) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setState("error");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <section className="px-5 pb-8 pt-8 md:px-14 md:pb-12 md:pt-16">
        <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground md:mb-8">
          <Link to="/" className="hover:text-foreground">
            главная
          </Link>
          <Icon name="ChevronRight" size={14} />
          <Link to="/partnery" className="hover:text-foreground">
            партнёры
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">анкета</span>
        </nav>
        <h1 className="max-w-[16ch] font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[64px]">
          Станьте партнёром agregatory.pro
        </h1>
        <p className="mt-5 max-w-[680px] text-[1.1em] leading-snug text-muted-foreground">
          Заполните анкету, и&nbsp;мы добавим ваш сервис в&nbsp;раздел партнёров. Его увидят рестораны со&nbsp;всей России, которые работают с&nbsp;доставкой. Обычно добавляем за&nbsp;пару рабочих дней и&nbsp;пишем вам в&nbsp;Telegram, когда карточка появится.
        </p>
      </section>

      <section className="px-5 pb-14 md:px-14 md:pb-24">
        {state === "done" ? (
          <div className="max-w-[760px] rounded-[24px] bg-foreground p-6 text-cream md:rounded-[32px] md:p-10">
            <Icon name="Check" size={32} className="text-brand" />
            <h2 className="mt-4 font-display text-[1.6em] font-semibold">Анкета отправлена</h2>
            <p className="mt-3 leading-relaxed text-cream-muted">
              Спасибо! Посмотрим анкету и&nbsp;свяжемся с&nbsp;вами. Если что-то захотите поправить, просто напишите нам в&nbsp;Telegram{" "}
              <a href="https://t.me/sitnikovy1" className="text-brand underline-offset-4 hover:underline">
                @sitnikovy1
              </a>
              .
            </p>
            <Link to="/partnery" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-foreground">
              к партнёрам
              <Icon name="ArrowRight" size={17} />
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="max-w-[860px] space-y-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

            <Block n={1} title="О компании">
              <div data-err="name">
                <Field label="Название компании или ваше имя" required error={errors.name}>
                  <input name="name" maxLength={120} className={field} placeholder="Например, Студия Кадр" />
                </Field>
              </div>
              <div data-err="site">
                <Field label="Сайт, портфолио или соцсети" required error={errors.site} hint="Сюда рестораны перейдут с кнопки на вашей карточке. Если сайта нет, подойдёт портфолио, страница VK, Telegram канал или просто ваш ник в Telegram: тогда на карточке будет кнопка «написать в Telegram».">
                  <input name="site" maxLength={300} className={field} placeholder="https://… или @ник в Telegram" />
                </Field>
              </div>
              <div data-err="section">
                <Field label="Раздел" required error={errors.section}>
                  <select value={section} onChange={(e) => setSection(e.target.value)} className={field}>
                    <option value="">выберите раздел</option>
                    {PARTNER_SECTIONS.filter((s) => s.id !== "drugoe").map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value={OTHER}>другое</option>
                  </select>
                </Field>
                {section === OTHER && (
                  <input name="section_other" maxLength={120} className={`${field} mt-3`} placeholder="Чем вы занимаетесь" />
                )}
              </div>
              <div data-err="geo">
                <span className="mb-1.5 block font-medium">
                  Где работаете<span className="text-foreground/50"> *</span>
                </span>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={allRussia} onChange={(e) => setAllRussia(e.target.checked)} className="h-5 w-5 accent-[hsl(var(--foreground))]" />
                  вся Россия, в том числе онлайн
                </label>
                {!allRussia && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {PARTNER_CITIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggle(cities, setCities, c)}
                          className={`rounded-lg border px-3 py-1.5 text-[max(12px,0.88em)] ${
                            cities.includes(c) ? "border-foreground bg-foreground text-background" : "border-foreground/15 bg-cream"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input value={otherCities} onChange={(e) => setOtherCities(e.target.value)} maxLength={300} className={`${field} mt-3`} placeholder="Другие города через запятую" />
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[max(12px,0.9em)]">
                  <span className="text-foreground/60">Страны СНГ:</span>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(countries, setCountries, c)}
                      className={`rounded-lg border px-3 py-1.5 ${countries.includes(c) ? "border-foreground bg-foreground text-background" : "border-foreground/15 bg-cream"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.geo && <span className="mt-1.5 block text-[max(12px,0.85em)] text-destructive">{errors.geo}</span>}
              </div>
              <div data-err="logo">
                <Field
                  label="Логотип или фото"
                  error={errors.logo}
                  hint="PNG, JPG, WEBP или SVG до 5 МБ, лучше квадратный. Если логотипа нет, приложите своё фото или фото работы. Можно пропустить: поставим знак с первой буквой названия."
                >
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-4 py-2 font-medium text-background">
                      <Icon name="Download" size={16} className="rotate-180" />
                      выбрать файл
                    </span>
                    <span className="text-[max(12px,0.9em)] text-foreground/60">{logo ? logo.name : "файл не выбран"}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </Field>
              </div>
            </Block>

            <Block n={2} title="Что увидят рестораны">
              <div data-err="tagline">
                <Field label="Одной строкой: чем вы полезны ресторану" required error={errors.tagline}>
                  <input name="tagline" maxLength={90} className={field} placeholder="Например, фото блюд для меню в Яндекс Еде" />
                </Field>
              </div>
              <Field label="Подробное описание" hint="Чем больше, тем лучше. Если не хотите писать, оставьте пустым: возьмём описание с вашего сайта и пришлём на согласование.">
                <textarea name="description" maxLength={3000} rows={6} className={field} />
              </Field>
              <Field label="Что входит в услуги" hint="Каждый пункт с новой строки, лучше от 3 до 8 пунктов.">
                <textarea name="points" maxLength={2000} rows={5} className={field} placeholder={"Съёмка блюд для меню\nОбработка фото под требования сервиса\nСъёмка на выезде"} />
              </Field>
              <Field label="Кому подойдёт">
                <textarea name="for_whom" maxLength={800} rows={3} className={field} placeholder="Каким ресторанам и в какой ситуации вы помогаете" />
              </Field>
              <Field label="Промокод или спецпредложение для наших клиентов" hint="Например, скидка 10% на первую съёмку. Напишите условия.">
                <textarea name="promo" maxLength={600} rows={2} className={field} />
              </Field>
              <Field label="Своя ссылка с метками" hint="Если хотите видеть переходы от нас у себя в аналитике.">
                <input name="utm_url" maxLength={400} className={field} placeholder="https://" inputMode="url" />
              </Field>
            </Block>

            <Block n={3} title="Контакт для связи">
              <p className="-mt-2 text-[max(12px,0.9em)] leading-snug text-foreground/60">
                Эти контакты на&nbsp;сайте не&nbsp;показываем, они нужны только нам для связи. Рестораны будут переходить к&nbsp;вам по&nbsp;ссылке из&nbsp;первого блока: на&nbsp;ваш сайт, портфолио или в&nbsp;соцсети, и&nbsp;там увидят ваши контакты.
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                <div data-err="contact_name">
                  <Field label="Имя" required error={errors.contact_name}>
                    <input name="contact_name" maxLength={120} className={field} autoComplete="name" />
                  </Field>
                </div>
                <Field label="Должность">
                  <input name="contact_role" maxLength={120} className={field} />
                </Field>
                <div data-err="contact" className="md:col-span-2">
                  <Field
                    label="Telegram для связи"
                    required
                    error={errors.contact}
                    hint="Нам удобнее связываться с вами только в Telegram. Напишите ник или телефон, к которому привязан Telegram. Сюда же напишем, когда ваша карточка появится на сайте."
                  >
                    <input name="contact_tg" maxLength={80} className={field} placeholder="@username или +7 900 000-00-00" />
                  </Field>
                </div>
                <Field label="Телефон для звонков">
                  <input name="contact_phone" maxLength={60} className={field} inputMode="tel" autoComplete="tel" />
                </Field>
                <Field label="Почта">
                  <input name="contact_email" maxLength={160} className={field} inputMode="email" autoComplete="email" />
                </Field>
              </div>
              <Field label="Готовы приводить к нам клиентов за вознаграждение?" hint="Это ни на что не влияет: ответ «нет» никак не скажется на том, разместим ли мы вашу карточку и как она будет показана.">
                <select name="referral" defaultValue="discuss" className={field}>
                  <option value="yes">да</option>
                  <option value="discuss">обсудить</option>
                  <option value="no">нет</option>
                </select>
              </Field>
            </Block>

            <div className="rounded-[24px] bg-pale p-5 md:rounded-[32px] md:p-8" data-err="consent">
              <label className="flex items-start gap-3">
                <input type="checkbox" name="consent" value="1" className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--foreground))]" />
                <span className="leading-snug">
                  Согласен на обработку персональных данных по{" "}
                  <Link to="/privacy" className="underline underline-offset-4">
                    политике конфиденциальности
                  </Link>{" "}
                  и подтверждаю, что тексты, логотип и фото можно публиковать на agregatory.pro.
                </span>
              </label>
              {errors.consent && <span className="mt-1.5 block text-[max(12px,0.85em)] text-destructive">{errors.consent}</span>}
              <p className="mt-4 text-[max(12px,0.88em)] leading-snug text-foreground/60">
                Мы смотрим каждую анкету и&nbsp;оставляем за&nbsp;собой право не&nbsp;размещать её без объяснения причин. Например, если сервис не&nbsp;подходит ресторанам, дублирует наши услуги или данные в&nbsp;анкете вызывают сомнения. Тексты можем сократить и&nbsp;поправить, перед публикацией пришлём на&nbsp;согласование.
              </p>
              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-7 py-4 font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {state === "sending" ? "отправляем…" : "отправить анкету"}
                <Icon name="ArrowRight" size={18} />
              </button>
              {state === "error" && (
                <p className="mt-3 text-destructive">
                  Не получилось отправить. Попробуйте ещё раз или напишите нам в Telegram{" "}
                  <a href="https://t.me/sitnikovy1" className="underline">
                    @sitnikovy1
                  </a>
                  .
                </p>
              )}
            </div>
          </form>
        )}
      </section>
      <Contacts />
    </main>
  );
};

export default PartnerApply;
