import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import ChecklistDownload from "./ChecklistDownload";
import ChecklistPrint from "./ChecklistPrint";
import ChannelsBlock from "@/components/shared/ChannelsBlock";
import { countItems, type ChecklistPage } from "@/data/checklists";
import { reachGoal } from "@/lib/metrika";

const ChecklistBoard = ({ page }: { page: ChecklistPage }) => {
  const storageKey = `checklist:${page.slug}`;
  const total = useMemo(() => countItems(page), [page]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setDone(raw ? JSON.parse(raw) : {});
    } catch {
      setDone({});
    }
  }, [storageKey]);

  const persist = (next: Record<string, boolean>) => {
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  };

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    if (!next[id]) delete next[id];
    persist(next);
    reachGoal("checklist_item", { slug: page.slug });
  };

  const doneCount = Object.keys(done).length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isComplete = doneCount >= total && total > 0;

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            {isComplete ? "Чек-лист пройден" : "Ваш прогресс"}
          </h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            {isComplete
              ? "Все пункты отмечены. Можно возвращаться к чек-листу при изменениях."
              : "Отмечайте выполненное — отметки сохранятся в браузере."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="text-right">
            <div className="font-display text-[2em] font-semibold leading-none text-brand">
              {progress}%
            </div>
            <div className="mt-1 text-[0.85em] text-cream-muted">
              {doneCount} из {total}
            </div>
          </div>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => persist({})}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-3.5 py-2.5 text-[0.85em] text-cream-muted transition-colors hover:border-cream/50 hover:text-cream"
            >
              <Icon name="RotateCcw" size={14} />
              сбросить
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-cream/12">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 space-y-8">
        {page.groups.map((group, gi) => {
          const groupDone = group.items.filter((_, ii) => done[`${gi}-${ii}`]).length;
          return (
            <div key={group.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-[1.2em] font-semibold text-cream">
                  {group.title}
                </h3>
                <span className="text-[0.85em] tabular-nums text-cream-muted">
                  {groupDone} / {group.items.length}
                </span>
              </div>

              <ul className="mt-4 space-y-2.5">
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const checked = !!done[id];
                  return (
                    <li key={item.text} id={`${gi + 1}-${ii + 1}`} className="scroll-mt-24">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggle(id)}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                          checked
                            ? "border-brand/50 bg-brand/10"
                            : "border-cream/15 bg-cream/[0.04] hover:border-cream/35"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                            checked ? "border-brand bg-brand text-foreground" : "border-cream/35"
                          }`}
                        >
                          {checked && <Icon name="Check" size={15} />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-[0.97em] leading-snug ${
                              checked ? "text-cream-muted line-through" : "text-cream"
                            }`}
                          >
                            {item.text}
                          </span>
                          {item.hint && (
                            <span className="mt-1 block text-[0.85em] leading-snug text-cream-muted">
                              {item.hint}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-start gap-4">
        <ChecklistDownload page={page} />
      </div>

      <div className="mt-8">
        <ChannelsBlock source={`checklist:${page.slug}`} variant="light" />
      </div>

      <div className="mt-4 rounded-[24px] bg-brand p-6 text-foreground md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.7em]">
              Проверим вашу карточку сами
            </h3>
            <p className="mt-2 max-w-[520px] leading-relaxed text-foreground/80">
              Пройдём по всем пунктам, найдём слабые места и покажем, что исправить в первую
              очередь. Бесплатно, результат за 2 рабочих дня.
            </p>
          </div>
          <a
            href="#lead"
            onClick={() => reachGoal("checklist_to_lead", { slug: page.slug })}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            бесплатный разбор
            <Icon name="ArrowRight" size={18} className="hidden shrink-0 min-[360px]:block" />
          </a>
        </div>
      </div>

      <ChecklistPrint page={page} />
    </div>
  );
};

export default ChecklistBoard;