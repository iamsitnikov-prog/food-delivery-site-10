// Текст из файла с реквизитами ресторана: Word, Excel, PDF, картинка или скан.
// Всё читается в браузере бухгалтера, файл никуда не отправляется.
// Скан и фото распознаются через tesseract.js (русский язык качается при первом запуске).

import PizZip from "pizzip";

export type Extracted = { text: string; how: string };
type Progress = (s: string) => void;

const ent = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const xmlText = (xml: string) =>
  xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>\s*<\/w:tc>/g, "\t")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:br[^>]*\/>/g, "\n")
    .replace(/<\/w:tc>/g, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/[\s\S]*/, (m) => ent(m));

function fromDocx(buf: ArrayBuffer) {
  const zip = new PizZip(buf);
  const parts = Object.keys(zip.files).filter((n) => /^word\/(document|header\d*|footer\d*)\.xml$/.test(n));
  return parts.map((n) => xmlText(zip.file(n)!.asText())).join("\n");
}

function fromXlsx(buf: ArrayBuffer) {
  const zip = new PizZip(buf);
  const shared = (zip.file("xl/sharedStrings.xml")?.asText() || "")
    .split("</si>")
    .map((si) => ent(si.replace(/<[^>]+>/g, "")));
  const sheets = Object.keys(zip.files).filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n));
  const lines: string[] = [];
  for (const n of sheets) {
    for (const row of zip.file(n)!.asText().split("</row>")) {
      const cells = [...row.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map((m) => {
        const type = /\bt="(\w+)"/.exec(m[1])?.[1];
        const body = m[2] || "";
        if (type === "inlineStr") return ent(body.replace(/<[^>]+>/g, ""));
        const v = /<v>([^<]*)<\/v>/.exec(body)?.[1] ?? "";
        return type === "s" ? shared[Number(v)] || "" : v;
      });
      if (cells.length) lines.push(cells.join(" "));
    }
  }
  return lines.join("\n");
}

async function pdfjs() {
  const lib = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  lib.GlobalWorkerOptions.workerSrc = worker;
  return lib;
}

async function ocr(images: (HTMLCanvasElement | Blob)[], progress: Progress) {
  progress("Распознаю скан: первый раз это до минуты, дальше быстрее…");
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["rus", "eng"], 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr/",
    langPath: "/ocr/lang",
    gzip: false,
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") progress(`Распознаю текст: ${Math.round(m.progress * 100)}%`);
    },
  });
  const out: string[] = [];
  for (const img of images) out.push((await worker.recognize(img)).data.text);
  await worker.terminate();
  return out.join("\n");
}

async function fromPdf(buf: ArrayBuffer, progress: Progress): Promise<Extracted> {
  const lib = await pdfjs();
  const doc = await lib.getDocument({ data: new Uint8Array(buf) }).promise;
  const pages = Math.min(doc.numPages, 5);
  let text = "";
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    // Собираем строки по высоте на странице, внутри строки — слева направо
    type It = { str: string; x: number; y: number; w: number };
    const items: It[] = (tc.items as { str?: string; transform?: number[]; width?: number }[])
      .filter((it) => it.str && it.transform)
      .map((it) => ({ str: it.str!, x: it.transform![4], y: it.transform![5], w: it.width || 0 }));
    const rows: It[][] = [];
    for (const it of items.sort((a, b) => b.y - a.y || a.x - b.x)) {
      const row = rows.find((r) => Math.abs(r[0].y - it.y) < 3);
      if (row) row.push(it);
      else rows.push([it]);
    }
    for (const r of rows) {
      // Разбиваем куски на буквы с примерным x: так знаки препинания, которые некоторые PDF
      // (например, из LibreOffice) рисуют отдельно поверх слов, встают на свои места.
      const chars: { c: string; x: number; cw: number }[] = [];
      for (const it of r) {
        if (!it.str.trim()) continue; // пробелы-заполнители: промежутки посчитаем по координатам
        const n = it.str.length;
        const cw = it.w / Math.max(n, 1);
        for (let k = 0; k < n; k++) chars.push({ c: it.str[k], x: it.x + (k + 0.5) * cw, cw });
      }
      chars.sort((p, q) => p.x - q.x);
      let line = "";
      let prev: { x: number; cw: number } | null = null;
      for (const ch of chars) {
        if (prev) {
          const gap = ch.x - prev.x;
          const unit = (ch.cw + prev.cw) / 2;
          if (gap > 25) line += "\t";
          else if (gap > unit * 1.45 && !line.endsWith(" ") && ch.c !== " ") line += " ";
        }
        line += ch.c;
        prev = ch;
      }
      line = line
        .replace(/[ ]{2,}/g, " ")
        .replace(/ +([,.;:)»])/g, "$1")
        .replace(/([«(]) +/g, "$1")
        .replace(/([А-Яа-яЁёA-Za-z0-9]) ?- ?([А-Яа-яЁёA-Za-z0-9])/g, "$1-$2")
        .replace(/,(?=[А-Яа-яЁё0-9])/g, ", ")
        .replace(/\.(?=[А-Яа-яЁё])/g, ". ")
        .replace(/(\d)\. (\d)/g, "$1.$2");
      text += line + "\n";
    }
    text += "\n";
  }
  if (text.replace(/\s/g, "").length > 40) return { text, how: "PDF" };
  // Текста нет: это скан. Рисуем страницы и распознаём.
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= Math.min(pages, 3); i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 2.5 });
    const c = document.createElement("canvas");
    c.width = vp.width;
    c.height = vp.height;
    await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
    canvases.push(c);
  }
  return { text: await ocr(canvases, progress), how: "скан PDF" };
}

/** Достаёт текст из файла реквизитов. Бросает ошибку с понятным текстом, если формат не подходит. */
export async function extractText(file: File, progress: Progress): Promise<Extracted> {
  const name = file.name.toLowerCase();
  if (file.size > 20_000_000) throw new Error("Файл больше 20 МБ. Пришлите карточку поменьше или скопируйте текст.");
  const buf = await file.arrayBuffer();
  if (name.endsWith(".docx")) return { text: fromDocx(buf), how: "Word" };
  if (name.endsWith(".xlsx")) return { text: fromXlsx(buf), how: "Excel" };
  if (name.endsWith(".pdf")) return fromPdf(buf, progress);
  if (/\.(txt|csv)$/.test(name)) {
    let text = new TextDecoder("utf-8").decode(buf);
    if (text.includes("�")) text = new TextDecoder("windows-1251").decode(buf);
    return { text, how: "текст" };
  }
  if (/\.(jpe?g|png|webp|bmp)$/.test(name) || file.type.startsWith("image/")) return { text: await ocr([file], progress), how: "фото" };
  if (/\.(doc|xls|rtf|odt)$/.test(name))
    throw new Error("Старый формат Word или Excel. Откройте файл и сохраните как .docx (или PDF), потом загрузите снова.");
  throw new Error("Этот формат не читаю. Подойдут Word (.docx), PDF, Excel (.xlsx), фото или скан.");
}
