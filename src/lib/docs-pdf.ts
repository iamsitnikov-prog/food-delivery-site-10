// PDF договора: рисуем Word-файл в скрытом окне и печатаем «Сохранить как PDF».
// Страницы режет браузер, поэтому поля, шапку и подвал задаём правилами печати (@page),
// а правила Word «не отрывать от следующего» и «строку не разрывать» переводим в CSS.

import PizZip from "pizzip";

const YELLOW = "#FFD900";
const GREY = "#8C8C8C";

// Логотип из шапки шаблона: печатается на каждой странице над жёлтой линией (61×3 мм, как в Word).
function headerLogo(blob: ArrayBuffer): string {
  try {
    const zip = new PizZip(blob);
    const f = Object.keys(zip.files).find((n) => /^word\/media\/image1\.(jpe?g|png)$/i.test(n));
    if (!f) return "";
    const b64 = btoa(zip.file(f)!.asBinary());
    const mime = f.toLowerCase().endsWith("png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${b64}`;
  } catch {
    return "";
  }
}

const printCss = (logo: string) => `
@page {
  size: A4;
  margin: 20mm 15mm 20mm 30mm;
  @top-left {
    content: "";
    width: 100%;
    background: ${logo ? `url("${logo}")` : "none"} no-repeat left bottom 2mm / 61mm 3mm;
    vertical-align: bottom;
    padding-bottom: 2mm;
    margin-bottom: 4mm;
    border-bottom: 2.25pt solid ${YELLOW};
  }
  @bottom-left {
    content: "Договор об оказании информационно-консультационных услуг";
    width: 75%;
    vertical-align: top;
    margin-top: 5mm;
    padding-top: 1.5mm;
    border-top: 0.75pt solid ${YELLOW};
    font: 8pt Arial, sans-serif;
    color: ${GREY};
  }
  @bottom-right {
    content: "Стр. " counter(page) " из " counter(pages);
    width: 25%;
    vertical-align: top;
    text-align: right;
    margin-top: 5mm;
    padding-top: 1.5mm;
    border-top: 0.75pt solid ${YELLOW};
    font: 8pt Arial, sans-serif;
    color: ${GREY};
  }
}
html, body { margin: 0; padding: 0; background: #fff; }
.docx-wrapper { background: #fff !important; padding: 0 !important; display: block !important; }
.docx-wrapper > section.docx {
  box-shadow: none !important; margin: 0 !important; padding: 0 !important;
  width: auto !important; min-height: 0 !important; height: auto !important;
}
.docx-wrapper > section.docx + section.docx { break-before: page; }
section.docx > header, section.docx > footer { display: none !important; }
table { table-layout: fixed !important; width: 100% !important; max-width: 100% !important; }
td, th { overflow-wrap: anywhere; }
tr { break-inside: avoid; }
.keep { break-after: avoid; }
.whole { break-inside: avoid; display: block; }
`;

/** Переводит «держать вместе» из Word в правила печати: связанные куски заворачиваем в неразрывный блок. */
function keepTogether(doc: Document) {
  const pageH = (297 - 40) * 3.7795; // высота текста страницы в px
  const text = (e: Element) => (e.textContent || "").replace(/\s+/g, " ").trim();
  const isHeading = (p: Element) => {
    const t = text(p);
    const letters = t.replace(/[^А-Яа-яЁёA-Za-z]/g, "");
    return letters.length > 3 && letters === letters.toUpperCase();
  };
  const keep = (e: Element | null) => {
    if (!e || e.tagName !== "P" || e.closest("table")) return false;
    const t = text(e);
    return isHeading(e) || t.endsWith(":") || /^Приложение № \d+$/.test(t) || /^к Договору/.test(t) || t === "Контакты сторон" || t === "";
  };
  const wrap = (els: Element[]) => {
    const h = els.reduce((s, e) => s + e.getBoundingClientRect().height, 0);
    if (h <= 0 || h > pageH * 0.9) return;
    const box = doc.createElement("div");
    box.className = "whole";
    els[0].before(box);
    els.forEach((e) => box.appendChild(e));
  };
  // таблица целиком (если она короче страницы) вместе с заголовком и абзацами, которые к ней относятся
  Array.from(doc.querySelectorAll("table")).forEach((t) => {
    if (t.parentElement?.closest("table") || t.closest(".whole")) return;
    const sign = /Подпись:|Услуги оказаны:/.test(text(t));
    const group: Element[] = [t];
    let prev = t.previousElementSibling;
    let texts = 0; // абзацев с текстом в группе: заголовки без ограничения (до 3), к подписи один абзац
    while (prev && !prev.closest(".whole") && prev.tagName === "P" && group.length < 25) {
      const empty = text(prev) === "";
      if (!empty && !(keep(prev) && texts < 3) && !(sign && texts < 1)) break;
      if (!empty) texts++;
      group.unshift(prev);
      prev = prev.previousElementSibling;
    }
    if (t.getBoundingClientRect().height < pageH * 0.8) wrap(group);
    else if (group.length > 1) {
      // длинная таблица: заголовок держим хотя бы с её началом
      group.slice(0, -1).forEach((e) => e.classList.add("keep"));
    }
  });
  // заголовок разделов не остаётся внизу страницы без текста
  Array.from(doc.querySelectorAll("p")).forEach((p) => {
    if (p.closest(".whole") || !keep(p) || text(p) === "") return;
    const next = p.nextElementSibling;
    if (next && next.tagName === "P" && !next.closest(".whole")) wrap([p, next]);
  });
}

/** Рисует договор в окне frame и готовит его к печати. */
export async function renderForPrint(blob: Blob, frame: HTMLIFrameElement, title: string) {
  const { renderAsync } = await import("docx-preview");
  const buf = await blob.arrayBuffer();
  const d = frame.contentDocument!;
  d.open();
  d.write(`<!doctype html><html><head><meta charset="utf-8"><title></title></head><body><div id="c"></div></body></html>`);
  d.close();
  d.title = title;
  const st = d.createElement("style");
  const logo = headerLogo(buf);
  st.textContent = printCss(logo);
  await renderAsync(buf, d.getElementById("c")!, d.head, {
    inWrapper: true,
    ignoreLastRenderedPageBreak: true,
    ignoreWidth: true,
    ignoreHeight: true,
    renderHeaders: false,
    renderFooters: false,
    breakPages: true,
  });
  d.head.appendChild(st); // после стилей docx-preview, чтобы наши правила были главнее
  await (d as Document & { fonts?: FontFaceSet }).fonts?.ready;
  keepTogether(d);
}
