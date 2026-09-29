import type { RefObject } from "react";
import Icon from "@/components/ui/icon";

const UploadDropzone = ({
  busy,
  drag,
  setDrag,
  fileName,
  error,
  inputRef,
  onDrop,
  onFile,
  onShowDemo,
  onReset,
}: {
  busy: boolean;
  drag: boolean;
  setDrag: (v: boolean) => void;
  fileName: string;
  error: string;
  inputRef: RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent) => void;
  onFile: (file: File) => void;
  onShowDemo: () => void;
  onReset: () => void;
}) => (
  <>
    <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
      загрузите свой отчёт
    </h2>
    <p className="mt-2 max-w-[640px] text-[0.95em] leading-snug text-cream-muted">
      Подойдёт любой из четырёх документов: отчёт о платёжных поручениях,
      информационный отчёт по заказам, расшифровка к отчёту или отчёт об
      исполнении поручения в PDF. Выгрузите файл из личного кабинета без
      изменений — не пересохраняйте и не редактируйте.
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
      <p className="mt-2 text-[max(12px,0.9em)] text-cream-muted">
        {busy ? fileName : "или нажмите, чтобы выбрать — xlsx, xls или pdf"}
      </p>
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

    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-cream/[0.06] p-4">
      <span className="text-[max(12px,0.9em)] leading-snug text-cream-muted">
        Нет файла под рукой?
      </span>
      <button
        type="button"
        onClick={onShowDemo}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[max(12px,0.9em)] font-medium text-foreground transition-transform hover:-translate-y-0.5"
      >
        <Icon name="Eye" size={16} />
        посмотреть на примере
      </button>
      <span className="text-[max(12px,0.82em)] leading-snug text-cream-muted">
        Откроем разбор на обезличенных данных
      </span>
    </div>

    <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-cream/[0.06] p-4 text-[max(12px,0.88em)] leading-snug text-cream-muted">
      <Icon name="ShieldCheck" size={18} className="mt-0.5 shrink-0 text-brand" />
      <span>
        <span className="text-cream">Файл никуда не отправляется.</span> Весь
        разбор происходит прямо в вашем браузере: мы не загружаем документ на
        сервер, не сохраняем и не видим его содержимое. Закроете вкладку —
        данные исчезнут.
      </span>
    </p>

    {error && (
      <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#C7161B]/15 p-4 text-[max(12px,0.9em)] leading-snug">
        <Icon name="CircleAlert" size={18} className="mt-0.5 shrink-0 text-[#ff6b6b]" />
        <span>
          {error}
          <button
            type="button"
            onClick={onReset}
            className="ml-2 underline hover:no-underline"
          >
            попробовать другой файл
          </button>
        </span>
      </p>
    )}
  </>
);

export default UploadDropzone;
