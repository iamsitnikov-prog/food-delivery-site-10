import { useCallback, useRef, useState } from "react";
import {
  parseWorkbook,
  parseFulfilment,
  formatRub as rub,
  type ParsedReport,
} from "@/lib/report-parser";
import { DEMO_REPORT } from "@/lib/demo-report";
import UploadDropzone from "@/components/reports/UploadDropzone";
import ResultHeader from "@/components/reports/ResultHeader";
import SharePanel from "@/components/reports/SharePanel";
import ReportBreakdown from "@/components/reports/ReportBreakdown";

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

const ReportUploader = () => {
  const [report, setReport] = useState<ParsedReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const showDemo = () => {
    setError("");
    setIsDemo(true);
    setShareOpen(false);
    setReport(DEMO_REPORT);
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError("");
    setReport(null);
    setIsDemo(false);
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
          "Не удалось распознать файл. Убедитесь, что загружен оригинальный отчёт сервиса без изменений.",
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
    setIsDemo(false);
    setShareOpen(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const suspicious = report?.buckets.filter((b) => b.suspicious && b.sum !== 0) ?? [];

  const shareText = (anon: boolean) => {
    if (!report) return "";
    const l: string[] = [];
    l.push(`Разбор отчёта — ${report.kindLabel}`);
    if (!anon && report.company) l.push(report.company);
    if (report.period) l.push(`Период: ${report.period}`);
    l.push("");
    l.push(`Оборот: ${rub(report.gross)} ₽`);
    l.push(`Удержал сервис: ${rub(report.withheld)} ₽`);
    l.push(`Осталось ресторану: ${rub(report.net)} ₽`);
    l.push("");
    l.push(`Реальная нагрузка на оборот: ${report.realRate.toFixed(1)}%`);
    if (report.declaredRate != null)
      l.push(`Ставка за услуги по договору: ${report.declaredRate.toFixed(1)}%`);
    const top = report.buckets.filter((b) => b.sum < 0).slice(0, 4);
    if (top.length) {
      l.push("");
      l.push("Куда ушли деньги:");
      for (const b of top) l.push(`• ${b.label}: ${rub(b.sum)} ₽`);
    }
    if (suspicious.length) {
      l.push("");
      l.push("Стоит уточнить:");
      for (const b of suspicious.slice(0, 3))
        l.push(`• ${b.label}: ${rub(b.sum)} ₽`);
    }
    l.push("");
    if (isDemo) l.push("Это демонстрационный пример, не реальный отчёт.");
    l.push("Разобрать свой отчёт: https://agregatory.pro/razbor-otchetov");
    return l.join("\n");
  };

  const shareTo = (where: "tg" | "wa" | "copy", anon: boolean) => {
    const text = shareText(anon);
    if (where === "copy") {
      navigator.clipboard?.writeText(text).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        },
        () => undefined,
      );
      return;
    }
    const url =
      where === "tg"
        ? `https://t.me/share/url?url=${encodeURIComponent("https://agregatory.pro/razbor-otchetov")}&text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
    lines.push(`Удержано сервисом: ${rub(report.withheld)} ₽`);
    lines.push(`К перечислению партнёру: ${rub(report.net)} ₽`);
    lines.push(`Фактическая нагрузка на оборот: ${report.realRate.toFixed(1)}%`);
    if (report.declaredRate != null)
      lines.push(`Ставка за услуги по договору: ${report.declaredRate.toFixed(1)}%`);
    lines.push("");
    lines.push("СОСТАВ УДЕРЖАНИЙ:");
    for (const b of report.buckets)
      lines.push(
        `  ${rub(b.sum)} ₽ — ${b.label}${b.count > 1 ? ` (${b.count} шт)` : ""}${b.suspicious ? " [ПРОВЕРИТЬ]" : ""}`,
      );
    if (report.payments.length) {
      lines.push("");
      lines.push("ПЛАТЁЖНЫЕ ПОРУЧЕНИЯ:");
      for (const p of report.payments) lines.push(`  ${rub(p.sum)} ₽ — ${p.label}`);
      lines.push(`  Итого перечислено: ${rub(report.paymentsTotal)} ₽`);
    }
    if (report.extra.length) {
      lines.push("");
      for (const e of report.extra) lines.push(`${e.label}: ${e.value}`);
    }
    lines.push("");
    lines.push(`РЕЗУЛЬТАТ СВЕРКИ: ${report.reconcileNote}`);
    if (report.warnings.length) {
      lines.push("");
      lines.push("ТРЕБУЕТ ПРОВЕРКИ:");
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
  const overpay =
    report && report.declaredRate != null
      ? report.realRate - report.declaredRate
      : null;

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      {!report && (
        <UploadDropzone
          busy={busy}
          drag={drag}
          setDrag={setDrag}
          fileName={fileName}
          error={error}
          inputRef={inputRef}
          onDrop={onDrop}
          onFile={handleFile}
          onShowDemo={showDemo}
          onReset={reset}
        />
      )}

      {report && (
        <div ref={resultRef}>
          <ResultHeader
            report={report}
            isDemo={isDemo}
            shareOpen={shareOpen}
            inputRef={inputRef}
            onFile={handleFile}
            onToggleShare={() => setShareOpen((v) => !v)}
            onDownload={download}
            onReset={reset}
          />

          {shareOpen && <SharePanel copied={copied} onShare={shareTo} />}

          <ReportBreakdown
            report={report}
            open={open}
            setOpen={setOpen}
            suspicious={suspicious}
            totalAbs={totalAbs}
            overpay={overpay}
          />
        </div>
      )}
    </div>
  );
};

export default ReportUploader;
