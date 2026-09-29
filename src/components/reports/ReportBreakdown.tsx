import Icon from "@/components/ui/icon";
import { formatRub as rub, type Bucket, type ParsedReport } from "@/lib/report-parser";

const Bar = ({
  value,
  total,
  accent,
}: {
  value: number;
  total: number;
  accent: boolean;
}) => {
  const pct = total > 0 ? Math.min(100, (Math.abs(value) / total) * 100) : 0;
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
      <div
        className={`h-full rounded-full ${accent ? "bg-[#C7161B]" : "bg-brand"}`}
        style={{ width: `${Math.max(pct, 1.5)}%` }}
      />
    </div>
  );
};

const ReportBreakdown = ({
  report,
  open,
  setOpen,
  suspicious,
  totalAbs,
  overpay,
}: {
  report: ParsedReport;
  open: string | null;
  setOpen: (v: string | null) => void;
  suspicious: Bucket[];
  totalAbs: number;
  overpay: number | null;
}) => (
  <>
    <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl bg-cream/[0.06] p-4 md:p-5">
        <span className="text-[0.85em] text-cream-muted">Валовый оборот</span>
        <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none">
          {rub(report.gross)} ₽
        </p>
      </div>
      <div className="rounded-2xl bg-cream/[0.06] p-4 md:p-5">
        <span className="text-[0.85em] text-cream-muted">Удержано сервисом</span>
        <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none text-[#ff6b6b]">
          {rub(report.withheld)} ₽
        </p>
      </div>
      <div className="rounded-2xl bg-brand p-4 md:p-5 text-foreground">
        <span className="text-[0.85em] text-foreground/70">К перечислению</span>
        <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none">
          {rub(report.net)} ₽
        </p>
      </div>
    </div>

    <div className="mt-4 rounded-2xl bg-cream/[0.06] p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
        <div>
          <span className="text-[0.85em] text-cream-muted">
            Фактическая нагрузка на оборот
          </span>
          <p className="mt-1 font-display text-[2.6em] font-semibold leading-none text-brand">
            {report.realRate.toFixed(1)}%
          </p>
        </div>
        {report.declaredRate != null && (
          <div className="text-right">
            <span className="text-[0.85em] text-cream-muted">Ставка по договору</span>
            <p className="mt-1 font-display text-[1.6em] font-semibold leading-none text-cream-muted">
              {report.declaredRate.toFixed(1)}%
            </p>
          </div>
        )}
      </div>
      {overpay != null && overpay > 0.5 && (
        <p className="mt-4 text-[0.92em] leading-snug">
          Фактически сервис удерживает на{" "}
          <span className="text-brand">{overpay.toFixed(1)} процентных пункта</span>{" "}
          больше ставки из договора. Разницу формируют маркетинговые услуги,
          абонентская плата и удержания по оферте: юридически это отдельные
          услуги, но для вашей выручки разницы нет. В деньгах —{" "}
          {rub(report.gross * (overpay / 100))} ₽ за период.
        </p>
      )}
    </div>

    <h3 className="mt-9 font-display text-[1.3em] font-semibold tracking-[-0.02em]">
      куда ушли деньги
    </h3>
    <div className="mt-4 space-y-2.5">
      {report.buckets.map((b) => {
        const isOpen = open === b.key;
        const share = report.gross > 0 ? (Math.abs(b.sum) / report.gross) * 100 : 0;
        return (
          <div
            key={b.key}
            className={`rounded-2xl p-4 transition-colors ${
              b.suspicious ? "bg-[#C7161B]/12" : "bg-cream/[0.06]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : b.key)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-3 md:gap-4 text-left"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-medium">
                  {b.suspicious && (
                    <Icon
                      name="TriangleAlert"
                      size={15}
                      className="shrink-0 text-[#ff6b6b]"
                    />
                  )}
                  {b.label}
                </span>
                <span className="mt-0.5 block text-[0.82em] text-cream-muted">
                  {b.count > 1 ? `${b.count} операций · ` : ""}
                  {share.toFixed(1)}% от оборота
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span
                  className={`font-display text-[1.15em] font-semibold ${
                    b.sum < 0 ? "text-[#ff6b6b]" : "text-brand"
                  }`}
                >
                  {rub(b.sum)} ₽
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-cream-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            <Bar value={b.sum} total={totalAbs} accent={!!b.suspicious} />
            {isOpen && (
              <p className="mt-3.5 border-t border-cream/12 pt-3.5 text-[0.9em] leading-snug text-cream-muted">
                {b.hint}
              </p>
            )}
          </div>
        );
      })}
    </div>

    <div
      className={`mt-9 rounded-2xl p-6 ${
        report.reconciled === true
          ? "bg-brand/15"
          : report.reconciled === false
            ? "bg-[#C7161B]/15"
            : "bg-cream/[0.06]"
      }`}
    >
      <h3 className="flex items-center gap-2.5 font-display text-[1.2em] font-semibold">
        <Icon
          name={
            report.reconciled === true
              ? "CircleCheck"
              : report.reconciled === false
                ? "CircleAlert"
                : "Info"
          }
          size={20}
          className={
            report.reconciled === true
              ? "text-brand"
              : report.reconciled === false
                ? "text-[#ff6b6b]"
                : "text-cream-muted"
          }
        />
        {report.reconciled === true
          ? "Расчёты сходятся"
          : report.reconciled === false
            ? "Выявлено расхождение"
            : "Сверка не выполнялась"}
      </h3>
      <p className="mt-3 text-[0.95em] leading-snug text-cream-muted">
        {report.reconcileNote}
      </p>
      {report.payments.length > 0 && (
        <div className="mt-5 space-y-1.5 border-t border-cream/12 pt-4">
          {report.payments.map((p) => (
            <div
              key={p.label}
              className="flex items-baseline justify-between gap-3 md:gap-4 text-[0.88em]"
            >
              <span className="min-w-0 truncate text-cream-muted">{p.label}</span>
              <span className="shrink-0 font-medium">{rub(p.sum)} ₽</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 md:gap-4 border-t border-cream/12 pt-2.5 text-[0.95em] font-semibold">
            <span>Итого перечислено</span>
            <span className="text-brand">{rub(report.paymentsTotal)} ₽</span>
          </div>
        </div>
      )}
    </div>

    {report.extra.length > 0 && (
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {report.extra.map((e) => (
          <div key={e.label} className="rounded-2xl bg-cream/[0.06] p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[0.88em] text-cream-muted">{e.label}</span>
              <span className="font-display text-[1.1em] font-semibold">{e.value}</span>
            </div>
            {e.hint && (
              <p className="mt-2 text-[0.82em] leading-snug text-cream-muted">{e.hint}</p>
            )}
          </div>
        ))}
      </div>
    )}

    {(suspicious.length > 0 || report.warnings.length > 0) && (
      <div className="mt-9 rounded-2xl border border-[#C7161B]/40 p-4 md:p-6">
        <h3 className="flex items-center gap-2.5 font-display text-[1.2em] font-semibold">
          <Icon name="Search" size={20} className="text-[#ff6b6b]" />
          что стоит уточнить
        </h3>
        <ul className="mt-4 space-y-3">
          {suspicious.map((b) => (
            <li key={b.key} className="flex gap-2.5 text-[0.92em] leading-snug">
              <Icon name="Dot" size={18} className="mt-0.5 shrink-0 text-[#ff6b6b]" />
              <span>
                <span className="font-medium">
                  {b.label} — {rub(b.sum)} ₽{b.count > 1 ? ` (${b.count} шт)` : ""}.
                </span>{" "}
                <span className="text-cream-muted">{b.hint}</span>
              </span>
            </li>
          ))}
          {report.warnings.map((w) => (
            <li key={w} className="flex gap-2.5 text-[0.92em] leading-snug">
              <Icon name="Dot" size={18} className="mt-0.5 shrink-0 text-[#ff6b6b]" />
              <span className="text-cream-muted">{w}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <p className="mt-6 flex items-start gap-2.5 text-[0.85em] leading-snug text-cream-muted">
      <Icon name="ShieldCheck" size={16} className="mt-0.5 shrink-0 text-brand" />
      Файл обработан локально в браузере: он не передавался на сервер и не
      сохранялся.
    </p>
  </>
);

export default ReportBreakdown;
