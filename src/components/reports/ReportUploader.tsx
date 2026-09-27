import { useCallback, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  parseWorkbook,
  parseFulfilment,
  formatRub as rub,
  type ParsedReport,
} from "@/lib/report-parser";

const readPdfText = async (file: File) => {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ");
    out += "\n";
  }
  return out;
};

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

const ReportUploader = () => {
  const [report, setReport] = useState<ParsedReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError("");
    setReport(null);
    setFileName(file.name);
    try {
      const isPdf =
        file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      const parsed = isPdf
        ? parseFulfilment(await readPdfText(file))
        : parseWorkbook(await file.arrayBuffer());
      setReport(parsed);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch (e) {
      setError(
        (e as Error).message ||
          "Не получилось прочитать файл. Убедитесь, что это оригинальный отчёт площадки.",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setReport(null);
    setError("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = () => {
    if (!report) return;
    const lines: string[] = [];
    lines.push(`РАЗБОР ОТЧЁТА — ${report.kindLabel}`);
    if (report.company) lines.push(`Компания: ${report.company}`);
    if (report.inn) lines.push(`ИНН: ${report.inn}`);
    if (report.contract) lines.push(`Договор: ${report.contract}`);
    if (report.period) lines.push(`Период: ${report.period}`);
    lines.push("");
    lines.push(`Оборот: ${rub(report.gross)} ₽`);
    lines.push(`Удержано площадкой: ${rub(report.withheld)} ₽`);
    lines.push(`Осталось ресторану: ${rub(report.net)} ₽`);
    lines.push(`Реальная нагрузка на оборот: ${report.realRate.toFixed(1)}%`);
    if (report.declaredRate != null)
      lines.push(`Заявленная комиссия: ${report.declaredRate.toFixed(1)}%`);
    lines.push("");
    lines.push("РАЗБИВКА ПО ТИПАМ:");
    for (const b of report.buckets)
      lines.push(
        `  ${rub(b.sum)} ₽ — ${b.label}${b.count > 1 ? ` (${b.count} шт)` : ""}${b.suspicious ? " [ПРОВЕРИТЬ]" : ""}`,
      );
    if (report.payments.length) {
      lines.push("");
      lines.push("ПЛАТЁЖНЫЕ ПОРУЧЕНИЯ:");
      for (const p of report.payments) lines.push(`  ${rub(p.sum)} ₽ — ${p.label}`);
      lines.push(`  Итого: ${rub(report.paymentsTotal)} ₽`);
    }
    if (report.extra.length) {
      lines.push("");
      for (const e of report.extra) lines.push(`${e.label}: ${e.value}`);
    }
    lines.push("");
    lines.push(`СВЕРКА: ${report.reconcileNote}`);
    if (report.warnings.length) {
      lines.push("");
      lines.push("НА ЧТО ОБРАТИТЬ ВНИМАНИЕ:");
      for (const w of report.warnings) lines.push(`  — ${w}`);
    }
    lines.push("");
    lines.push("Разбор сделан на agregatory.pro/razbor-otchetov");
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `razbor-${report.kind}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalAbs = report
    ? Math.max(...report.buckets.map((b) => Math.abs(b.sum)), 1)
    : 1;
  const suspicious = report?.buckets.filter((b) => b.suspicious && b.sum !== 0) ?? [];
  const overpay =
    report && report.declaredRate != null
      ? report.realRate - report.declaredRate
      : null;

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      {!report && (
        <>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            загрузите свой отчёт
          </h2>
          <p className="mt-2 max-w-[640px] text-[0.95em] leading-snug text-cream-muted">
            Подойдёт любой из четырёх: отчёт по платёжным поручениям, отчёт по
            заказам, расшифровка или отчёт об исполнении поручения в PDF.
            Скачайте его из кабинета площадки как есть, ничего не меняя.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            className={`mt-7 cursor-pointer rounded-[24px] border-2 border-dashed p-10 text-center transition-colors md:p-14 ${
              drag
                ? "border-brand bg-brand/10"
                : "border-cream/25 hover:border-cream/50 hover:bg-cream/[0.04]"
            }`}
          >
            <Icon
              name={busy ? "LoaderCircle" : "FileUp"}
              size={40}
              className={`mx-auto text-brand ${busy ? "animate-spin" : ""}`}
            />
            <p className="mt-5 font-display text-[1.25em] font-semibold">
              {busy ? "читаю файл…" : "перетащите файл сюда"}
            </p>
            <p className="mt-2 text-[0.9em] text-cream-muted">
              {busy ? fileName : "или нажмите, чтобы выбрать — xlsx, xls или pdf"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-cream/[0.06] p-4 text-[0.88em] leading-snug text-cream-muted">
            <Icon name="ShieldCheck" size={18} className="mt-0.5 shrink-0 text-brand" />
            <span>
              <span className="text-cream">Файл никуда не отправляется.</span> Весь
              разбор происходит прямо в вашем браузере: мы не загружаем документ на
              сервер, не сохраняем и не видим его содержимое. Закроете вкладку —
              данные исчезнут.
            </span>
          </p>

          {error && (
            <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#C7161B]/15 p-4 text-[0.9em] leading-snug">
              <Icon name="CircleAlert" size={18} className="mt-0.5 shrink-0 text-[#ff6b6b]" />
              <span>
                {error}
                <button
                  type="button"
                  onClick={reset}
                  className="ml-2 underline hover:no-underline"
                >
                  попробовать другой файл
                </button>
              </span>
            </p>
          )}
        </>
      )}

      {report && (
        <div ref={resultRef}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-[0.78em] font-bold uppercase tracking-wide text-foreground">
                <Icon name="FileCheck" size={14} />
                {report.kindLabel}
              </span>
              <h2 className="mt-4 font-display text-[1.5em] font-semibold tracking-[-0.02em]">
                {report.company || "ваш отчёт"}
              </h2>
              <p className="mt-1.5 text-[0.88em] text-cream-muted">
                {[
                  report.period && `период ${report.period}`,
                  report.contract && `договор ${report.contract}`,
                  report.orders > 0 && `${report.orders} заказов`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[0.9em] font-medium text-foreground transition-transform hover:-translate-y-0.5"
              >
                <Icon name="Download" size={16} />
                скачать разбор
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[0.9em] transition-colors hover:border-cream/60"
              >
                <Icon name="RotateCcw" size={16} />
                другой файл
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-cream/[0.06] p-5">
              <span className="text-[0.85em] text-cream-muted">Оборот за период</span>
              <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none">
                {rub(report.gross)} ₽
              </p>
            </div>
            <div className="rounded-2xl bg-cream/[0.06] p-5">
              <span className="text-[0.85em] text-cream-muted">Удержала площадка</span>
              <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none text-[#ff6b6b]">
                {rub(report.withheld)} ₽
              </p>
            </div>
            <div className="rounded-2xl bg-brand p-5 text-foreground">
              <span className="text-[0.85em] text-foreground/70">Осталось вам</span>
              <p className="mt-1.5 font-display text-[1.7em] font-semibold leading-none">
                {rub(report.net)} ₽
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-cream/[0.06] p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[0.85em] text-cream-muted">
                  Реальная нагрузка на оборот
                </span>
                <p className="mt-1 font-display text-[2.6em] font-semibold leading-none text-brand">
                  {report.realRate.toFixed(1)}%
                </p>
              </div>
              {report.declaredRate != null && (
                <div className="text-right">
                  <span className="text-[0.85em] text-cream-muted">
                    Заявленная комиссия
                  </span>
                  <p className="mt-1 font-display text-[1.6em] font-semibold leading-none text-cream-muted">
                    {report.declaredRate.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
            {overpay != null && overpay > 0.5 && (
              <p className="mt-4 text-[0.92em] leading-snug">
                Фактически площадка забирает на{" "}
                <span className="text-brand">{overpay.toFixed(1)} процентных пункта</span>{" "}
                больше, чем указано в договоре. Разницу дают продвижение, подписка и
                прочие услуги — их считают отдельно от комиссии, но платите их всё
                равно вы. В деньгах это{" "}
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
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium">
                        {b.suspicious && (
                          <Icon name="TriangleAlert" size={15} className="shrink-0 text-[#ff6b6b]" />
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
                ? "Отчёт сходится"
                : report.reconciled === false
                  ? "Есть расхождение"
                  : "Сверка не проводилась"}
            </h3>
            <p className="mt-3 text-[0.95em] leading-snug text-cream-muted">
              {report.reconcileNote}
            </p>
            {report.payments.length > 0 && (
              <div className="mt-5 space-y-1.5 border-t border-cream/12 pt-4">
                {report.payments.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-baseline justify-between gap-4 text-[0.88em]"
                  >
                    <span className="min-w-0 truncate text-cream-muted">{p.label}</span>
                    <span className="shrink-0 font-medium">{rub(p.sum)} ₽</span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 border-t border-cream/12 pt-2.5 text-[0.95em] font-semibold">
                  <span>Итого поступило</span>
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
                    <span className="font-display text-[1.1em] font-semibold">
                      {e.value}
                    </span>
                  </div>
                  {e.hint && (
                    <p className="mt-2 text-[0.82em] leading-snug text-cream-muted">
                      {e.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {(suspicious.length > 0 || report.warnings.length > 0) && (
            <div className="mt-9 rounded-2xl border border-[#C7161B]/40 p-6">
              <h3 className="flex items-center gap-2.5 font-display text-[1.2em] font-semibold">
                <Icon name="Search" size={20} className="text-[#ff6b6b]" />
                что стоит проверить
              </h3>
              <ul className="mt-4 space-y-3">
                {suspicious.map((b) => (
                  <li key={b.key} className="flex gap-2.5 text-[0.92em] leading-snug">
                    <Icon name="Dot" size={18} className="mt-0.5 shrink-0 text-[#ff6b6b]" />
                    <span>
                      <span className="font-medium">
                        {b.label} — {rub(b.sum)} ₽
                        {b.count > 1 ? ` (${b.count} шт)` : ""}.
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
            Файл остался в вашем браузере — мы его не загружали и не сохраняли.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportUploader;
