import Icon from "@/components/ui/icon";
import BuildersCalc, { BUILDERS } from "@/components/calc/BuildersCalc";

const FEATURES: { key: "hasApp" | "hasLoyalty" | "hasCrm" | "forNetwork"; label: string }[] = [
  { key: "hasApp", label: "Мобильное приложение" },
  { key: "hasLoyalty", label: "Программа лояльности" },
  { key: "hasCrm", label: "CRM и рассылки" },
  { key: "forNetwork", label: "Работа с сетью точек" },
];

const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const BuildersBlock = () => (
  <>
    <section className="px-5 pb-10 md:px-14 md:pb-20">
      <div className="overflow-x-auto rounded-[28px] bg-surface p-2 md:p-4">
        <table className="w-full min-w-[760px] border-collapse text-cream">
          <thead>
            <tr>
              <th className="w-[210px] p-4 text-left align-bottom text-[max(12px,0.85em)] font-normal text-cream-muted">
                Возможность
              </th>
              {BUILDERS.map((b) => (
                <th key={b.slug} className="p-4 text-left align-bottom">
                  <span className="block font-display text-[1.2em] font-semibold leading-tight">
                    {b.name}
                  </span>
                  <span className="mt-1.5 block text-[max(12px,0.8em)] font-normal leading-snug text-brand">
                    {b.tagline}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-cream/12">
              <th className="p-4 text-left align-top text-[max(12px,0.9em)] font-medium text-cream-muted">
                Ориентир по цене
              </th>
              {BUILDERS.map((b) => (
                <td key={b.slug} className="p-4 align-top text-[0.92em] leading-snug">
                  от {rub(b.fee)} ₽ / мес
                  <span className="mt-1 block text-[max(12px,0.85em)] text-cream-muted">
                    {b.feeNote}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-t border-cream/12">
              <th className="p-4 text-left align-top text-[max(12px,0.9em)] font-medium text-cream-muted">
                Комиссия с заказа
              </th>
              {BUILDERS.map((b) => (
                <td key={b.slug} className="p-4 align-top text-[0.92em] leading-snug">
                  нет — заказы ваши
                </td>
              ))}
            </tr>
            {FEATURES.map((f) => (
              <tr key={f.key} className="border-t border-cream/12">
                <th className="p-4 text-left align-top text-[max(12px,0.9em)] font-medium text-cream-muted">
                  {f.label}
                </th>
                {BUILDERS.map((b) => (
                  <td key={b.slug} className="p-4 align-top">
                    {b[f.key] ? (
                      <span className="inline-flex items-center gap-1.5 text-[max(12px,0.9em)] text-brand">
                        <Icon name="Check" size={16} />
                        есть
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[max(12px,0.9em)] text-cream-muted">
                        <Icon name="Minus" size={16} />
                        нет или ограничено
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-cream/12">
              <th className="p-4 text-left align-top text-[max(12px,0.9em)] font-medium text-cream-muted">
                Кому подходит
              </th>
              {BUILDERS.map((b) => (
                <td
                  key={b.slug}
                  className="p-4 align-top text-[max(12px,0.9em)] leading-snug text-cream-muted"
                >
                  {b.bestFor}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        посчитайте
        <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">на своих цифрах</span>
      </h2>
      <p className="mt-5 max-w-[660px] leading-snug text-muted-foreground">
        Отметьте, что вам нужно, и подставьте свои цифры — увидите, сколько
        остаётся после платы за платформу и какие сервисы закрывают ваши задачи.
      </p>
      <div className="mt-8">
        <BuildersCalc />
      </div>
    </section>

    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        сильные и слабые
        <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">стороны</span>
      </h2>
      <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
        {BUILDERS.map((b) => (
          <article key={b.slug} className="rounded-[28px] bg-surface p-4 text-cream md:p-8">
            <h3 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.02em]">
              {b.name}
            </h3>
            <p className="mt-1.5 text-[max(12px,0.9em)] leading-snug text-brand">{b.tagline}</p>
            <p className="mt-4 text-[max(12px,0.88em)] leading-snug text-cream-muted">
              Ориентир по цене: от {rub(b.fee)} ₽ в месяц. {b.feeNote}.
            </p>

            <ul className="mt-5 space-y-2.5">
              {b.strong.map((s) => (
                <li key={s} className="flex gap-2.5 text-[0.92em] leading-snug">
                  <Icon name="Plus" size={16} className="mt-0.5 shrink-0 text-brand" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-5 space-y-2.5 border-t border-cream/12 pt-5">
              {b.weak.map((s) => (
                <li
                  key={s}
                  className="flex gap-2.5 text-[0.92em] leading-snug text-cream-muted"
                >
                  <Icon name="Minus" size={16} className="mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-2xl bg-cream/[0.06] p-4 text-[max(12px,0.9em)] leading-snug">
              <span className="text-brand">Кому подходит. </span>
              {b.bestFor}
            </p>

            {b.url && (
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[max(12px,0.9em)] font-medium text-brand hover:underline"
              >
                перейти на сайт
                {b.promo && ` · промокод ${b.promo}`}
                <Icon name="ArrowUpRight" size={16} />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>

    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <div className="rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-12">
        <h2 className="font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[44px]">
          выводы
        </h2>
        <div className="mt-8 grid gap-7 md:grid-cols-2">
          <div>
            <h3 className="font-display text-[1.2em] font-semibold text-brand">
              Дешевле не значит выгоднее
            </h3>
            <p className="mt-2.5 leading-relaxed text-cream-muted">
              Разница между платформами в подписке — несколько тысяч рублей в
              месяц. Разница в результате измеряется процентом гостей, которые
              вернулись. Платформа без приложения и лояльности даёт вам сайт, на
              который никто не заходит второй раз: гость заказал и забыл. Считать
              нужно не стоимость подписки, а стоимость удержанного гостя.
            </p>
          </div>
          <div>
            <h3 className="font-display text-[1.2em] font-semibold text-brand">
              Приложение решает больше, чем сайт
            </h3>
            <p className="mt-2.5 leading-relaxed text-cream-muted">
              Иконка на экране телефона — это канал, который всегда под рукой, и
              push-уведомления, которые доходят бесплатно. Сайт заказа такого не
              даёт: чтобы вернуть гостя, придётся каждый раз платить за рекламу.
              Поэтому платформы с приложением и CRM окупаются быстрее, несмотря
              на более высокую подписку.
            </p>
          </div>
          <div>
            <h3 className="font-display text-[1.2em] font-semibold text-brand">
              База гостей — это актив
            </h3>
            <p className="mt-2.5 leading-relaxed text-cream-muted">
              На агрегаторе контакты гостей принадлежат площадке: вы не знаете,
              кто у вас заказывал, и не можете написать этому человеку. В своём
              канале база остаётся у вас навсегда. Через год работы это главное,
              что отличает заведение с собственным каналом от того, кто просто
              платит комиссию.
            </p>
          </div>
          <div>
            <h3 className="font-display text-[1.2em] font-semibold text-brand">
              Порог входа ниже, чем кажется
            </h3>
            <p className="mt-2.5 leading-relaxed text-cream-muted">
              Плата за платформу делится на комиссию с одного заказа — и обычно
              выходит один-два прямых заказа в день. Ошибка не в том, чтобы
              запустить свой канал рано, а в том, чтобы годами платить процент с
              гостей, которые и так знают ваш адрес.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default BuildersBlock;
