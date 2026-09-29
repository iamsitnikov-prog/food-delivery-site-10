import { useState } from "react";
import Icon from "@/components/ui/icon";

const rub = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);

const Field = ({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block text-[0.9em] font-medium text-cream">{label}</label>
    <p className="mt-1 text-[0.8em] leading-snug text-cream-muted">{hint}</p>
    <div className="mt-2 flex items-center gap-2 rounded-xl bg-cream/[0.08] px-4 py-3 focus-within:bg-cream/[0.12]">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full bg-transparent font-display text-[1.1em] font-semibold text-cream outline-none placeholder:text-cream-muted/50"
      />
      <span className="shrink-0 text-cream-muted">₽</span>
    </div>
  </div>
);

const toNum = (s: string) => {
  const n = Number.parseFloat(
    s.replace(/\s|\u00a0/g, "").replace(",", ".").replace(/[^\d.-]/g, ""),
  );
  return Number.isFinite(n) ? n : 0;
};

const ReconcileCalc = () => {
  const [opening, setOpening] = useState("");
  const [total, setTotal] = useState("");
  const [withheld, setWithheld] = useState("");
  const [toPay, setToPay] = useState("");
  const [paid, setPaid] = useState("");
  const [closing, setClosing] = useState("");

  const o = toNum(opening);
  const t = toNum(total);
  const w = Math.abs(toNum(withheld));
  const p = toNum(toPay);
  const f = toNum(paid);
  const c = toNum(closing);

  const filled = [total, withheld, toPay].every((v) => v.trim() !== "");
  const filledSaldo = [toPay, paid, closing].every((v) => v.trim() !== "");

  const calcPay = t - w;
  const diffPay = calcPay - p;
  const okPay = Math.abs(diffPay) < 0.5;

  const calcClosing = o + p - f;
  const diffClosing = calcClosing - c;
  const okClosing = Math.abs(diffClosing) < 0.5;

  const rate = t > 0 ? (w / t) * 100 : 0;

  const Row = ({
    ok,
    title,
    formula,
    note,
  }: {
    ok: boolean;
    title: string;
    formula: string;
    note: string;
  }) => (
    <div className={`rounded-2xl p-5 ${ok ? "bg-brand/15" : "bg-[#C7161B]/15"}`}>
      <h4 className="flex items-center gap-2.5 font-display text-[1.1em] font-semibold">
        <Icon
          name={ok ? "CircleCheck" : "CircleAlert"}
          size={19}
          className={ok ? "text-brand" : "text-[#ff6b6b]"}
        />
        {title}
      </h4>
      <p className="mt-2.5 font-mono text-[0.85em] leading-relaxed text-cream-muted">
        {formula}
      </p>
      <p className="mt-2.5 text-[0.92em] leading-snug">{note}</p>
    </div>
  );

  return (
    <div className="rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-11">
        <div>
          <h3 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            перепишите шесть чисел
          </h3>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Все значения приведены в разделе 3 отчёта об исполнении поручения.
            Переносите как есть — расчёт выполняется автоматически.
          </p>

          <div className="mt-7 space-y-5">
            <Field
              label="Входящее сальдо"
              hint="Первая строка раздела 3 — задолженность сервиса с прошлого периода"
              value={opening}
              onChange={setOpening}
            />
            <Field
              label="Итого подлежит перечислению"
              hint="Пункт 1 — совокупность платежей гостей за период"
              value={total}
              onChange={setTotal}
            />
            <Field
              label="Подлежит удержанию"
              hint="Пункт 3 — стоимость услуг, неустойки и удержания"
              value={withheld}
              onChange={setWithheld}
            />
            <Field
              label="Подлежит к перечислению"
              hint="Пункт 4 — сумма к перечислению за период"
              value={toPay}
              onChange={setToPay}
            />
            <Field
              label="Фактически перечислено"
              hint="Пункт 5 — фактически перечислено на расчётный счёт"
              value={paid}
              onChange={setPaid}
            />
            <Field
              label="Исходящее сальдо"
              hint="Последняя строка — задолженность на конец периода"
              value={closing}
              onChange={setClosing}
            />
          </div>
        </div>

        <div>
          <h3 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            что показывает проверка
          </h3>

          {!filled && !filledSaldo && (
            <p className="mt-5 rounded-2xl bg-cream/[0.06] p-4 md:p-6 leading-relaxed text-cream-muted">
              Заполните поля слева — контроль выполнится автоматически. Расчёт
              производится в браузере, данные не передаются на сервер.
            </p>
          )}

          <div className="mt-5 space-y-3">
            {filled && (
              <Row
                ok={okPay}
                title={okPay ? "Расчёт удержаний сходится" : "Удержания не сходятся"}
                formula={`${rub(t)} − ${rub(w)} = ${rub(calcPay)}   (в отчёте: ${rub(p)})`}
                note={
                  okPay
                    ? "Итого поступлений минус удержания равно сумме к перечислению. Расчёт корректен."
                    : `Расхождение ${rub(Math.abs(diffPay))} ₽. Запросите письменные разъяснения до подписания отчёта.`
                }
              />
            )}

            {filledSaldo && (
              <Row
                ok={okClosing}
                title={okClosing ? "Сальдо сходится" : "Сальдо не сходится"}
                formula={`${rub(o)} + ${rub(p)} − ${rub(f)} = ${rub(calcClosing)}   (в отчёте: ${rub(c)})`}
                note={
                  okClosing
                    ? `Движение средств корректно. Разница между начисленным и выплаченным в размере ${rub(Math.abs(p - f))} ₽ — переходящий остаток. Проконтролируйте его отражение как входящего сальдо в следующем периоде.`
                    : `Расхождение ${rub(Math.abs(diffClosing))} ₽. Запросите расшифровку движения денежных средств за период.`
                }
              />
            )}

            {filled && t > 0 && (
              <div className="rounded-2xl bg-cream/[0.06] p-4 md:p-5">
                <h4 className="font-display text-[1.1em] font-semibold">
                  Фактическая нагрузка на оборот
                </h4>
                <p className="mt-2 font-display text-[2.2em] font-semibold leading-none text-brand">
                  {rate.toFixed(1)}%
                </p>
                <p className="mt-3 text-[0.92em] leading-snug text-cream-muted">
                  Доля удержаний в валовом обороте за период. Если ставка в
                  договоре ниже — разницу формируют маркетинговые услуги,
                  абонентская плата и удержания по оферте: они не входят в
                  стоимость услуг за заказ.
                </p>
              </div>
            )}

            {filledSaldo && c > 0 && (
              <p className="flex items-start gap-2.5 rounded-2xl bg-cream/[0.06] p-4 md:p-5 text-[0.9em] leading-snug text-cream-muted">
                <Icon name="Clock" size={17} className="mt-0.5 shrink-0 text-brand" />
                <span>
                  Задолженность сервиса на конец периода — {rub(c)} ₽.
                  Средства не утрачены, но и не поступили на счёт: зафиксируйте
                  сумму и сверьте с входящим сальдо следующего отчёта.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconcileCalc;
