import type { RefObject } from "react";
import Icon from "@/components/ui/icon";
import type { ParsedReport } from "@/lib/report-parser";

const ResultHeader = ({
  report,
  isDemo,
  shareOpen,
  inputRef,
  onFile,
  onToggleShare,
  onDownload,
  onReset,
}: {
  report: ParsedReport;
  isDemo: boolean;
  shareOpen: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onFile: (file: File) => void;
  onToggleShare: () => void;
  onDownload: () => void;
  onReset: () => void;
}) => (
  <>
    {isDemo && (
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brand/40 bg-brand/10 p-4">
        <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-[max(12px,0.75em)] font-bold uppercase tracking-wide text-foreground">
          <Icon name="Eye" size={13} />
          пример
        </span>
        <span className="min-w-0 flex-1 text-[max(12px,0.9em)] leading-snug text-cream-muted">
          Так выглядит разбор. Цифры взяты из реального отчёта за неделю,
          название и реквизиты убраны.
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[max(12px,0.88em)] font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          <Icon name="FileUp" size={15} />
          загрузить свой отчёт
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
      </div>
    )}

    <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4">
      <div>
        <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-[max(12px,0.78em)] font-bold uppercase tracking-wide text-foreground">
          <Icon name="FileCheck" size={14} />
          {report.kindLabel}
        </span>
        <h2 className="mt-4 font-display text-[1.5em] font-semibold tracking-[-0.02em]">
          {report.company || "ваш отчёт"}
        </h2>
        <p className="mt-1.5 text-[max(12px,0.88em)] text-cream-muted">
          {[
            report.period && `период ${report.period}`,
            report.contract && `договор ${report.contract}`,
            report.orders > 0 && `${report.orders} заказов`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onToggleShare}
          aria-expanded={shareOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[max(12px,0.9em)] font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          <Icon name="Share2" size={16} />
          поделиться
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[max(12px,0.9em)] transition-colors hover:border-cream/60"
        >
          <Icon name="Download" size={16} />
          скачать
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[max(12px,0.9em)] transition-colors hover:border-cream/60"
        >
          <Icon name="RotateCcw" size={16} />
          другой файл
        </button>
      </div>
    </div>
  </>
);

export default ResultHeader;
