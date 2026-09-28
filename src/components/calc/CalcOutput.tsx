import Icon from "@/components/ui/icon";
import { Row, Card, ChannelBlock } from "./CalcParts";
import { money, percent, type CalcInput, type CalcResult } from "@/lib/calc";
import type { CalcMode } from "./Calculator";

type Props = {
  input: CalcInput;
  r: CalcResult;
  show: (block: CalcMode) => boolean;
};

const CalcOutput = ({ input, r, show }: Props) => {
  const aggOn = input.aggEnabled;
  const selfOn = input.selfEnabled;

  // Без заказов или без расходов на рекламу вердикт «реклама окупается» вводит
  // в заблуждение: окупаться нечему. Показываем нейтральную подсказку.
  const hasAdData = r.adSpendPerMonth > 0 && r.ordersPerDay > 0;

  const drrColor = !hasAdData
    ? "text-cream-muted"
    : r.drrVerdict === "good"
      ? "text-brand"
      : r.drrVerdict === "ok"
        ? "text-cream"
        : "text-red-400";
  const drrText = !hasAdData
    ? r.ordersPerDay > 0
      ? "Расходы на рекламу не заданы"
      : "Укажите количество заказов"
    : r.drrVerdict === "good"
      ? "В норме — реклама окупается"
      : r.drrVerdict === "ok"
        ? "На границе — стоит следить"
        : "Завышен — реклама съедает прибыль";

  return (
    <div className="space-y-4">
      {show("profit") && aggOn && (
        <Card title="Экономика заказа — агрегатор" icon="Store">
          <ChannelBlock c={r.agg} title="агрегатор" />
        </Card>
      )}

      {show("profit") && selfOn && (
        <Card title="Экономика заказа — своя доставка" icon="House">
          <ChannelBlock c={r.self} title="своя доставка" />
        </Card>
      )}

      {show("profit") && r.bothChannels && (
        <Card title="Итого по каналам" icon="Layers">
          <Row label="Заказов в день · orders" value={`${money(r.ordersPerDay)} шт`} muted />
          <Row label="Средний чек · average check" value={`${money(r.avgCheck)} ₽`} muted />
          <Row label="Выручка в месяц · revenue" value={`${money(r.revenuePerMonth)} ₽`} />
          <Row label="Поступит на счёт" value={`${money(r.payoutPerMonth)} ₽`} muted />
          <Row
            label="Валовая прибыль · gross profit"
            value={`${money(r.grossProfitPerMonth)} ₽`}
            accent
            strong
          />
          <Row label="Маржинальность · margin" value={percent(r.marginPercent)} />
        </Card>
      )}

      {show("profit") && r.anyChannel && !r.isProfitable && (
        <p className="flex gap-2 rounded-xl bg-red-500/15 p-4 text-[0.88em] leading-snug text-red-200">
          <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
          При таких условиях заказы не приносят прибыли — каждый новый заказ увеличивает убыток.
        </p>
      )}

      {show("drr") && r.anyChannel && (
        <Card title="ДРР · доля рекламных расходов" icon="Percent">
          <div className="flex flex-wrap items-end gap-3">
            <span className={`font-display text-[2.6em] font-semibold leading-none ${drrColor}`}>
              {hasAdData ? percent(r.drr) : "—"}
            </span>
            <span className={`pb-1 text-[0.9em] leading-snug ${drrColor}`}>{drrText}</span>
          </div>
          <div className="mt-4">
            {r.bothChannels && (
              <>
                <Row label="ДРР агрегатора" value={percent(r.agg.drr)} muted />
                <Row label="ДРР своей доставки" value={percent(r.self.drr)} muted />
              </>
            )}
            <Row
              label="Расходы на рекламу · ad spend"
              value={`${money(r.adSpendPerMonth)} ₽`}
              muted
            />
            <Row label="Выручка · revenue" value={`${money(r.revenuePerMonth)} ₽`} muted />
            <Row
              label="ROMI · возврат на маркетинг"
              value={r.adSpendPerMonth > 0 ? percent(r.romi, 0) : "—"}
            />
            <Row label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
          </div>
          <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">
            Выше предельного значения продвижение работает в убыток. Ориентир для устойчивой работы
            — до 12%.
          </p>
        </Card>
      )}

      {show("breakeven") && input.staffEnabled && r.anyChannel && (
        <Card title="Персонал доставки" icon="Users">
          {r.managersCost > 0 && <Row label="Менеджеры" value={`${money(r.managersCost)} ₽`} muted />}
          {r.couriersCost > 0 && <Row label="Курьеры" value={`${money(r.couriersCost)} ₽`} muted />}
          {r.fuelCost > 0 && (
            <Row label="Компенсация топлива" value={`${money(r.fuelCost)} ₽`} muted />
          )}
          {r.packersCost > 0 && <Row label="Сборщики" value={`${money(r.packersCost)} ₽`} muted />}
          <Row
            label="Страховые взносы · payroll tax"
            value={`${money(r.insuranceCost)} ₽`}
            muted
          />
          <Row label="Всего · payroll" value={`${money(r.staffTotal)} ₽`} accent strong />
          <Row label="В пересчёте на заказ" value={`${money(r.staffPerOrder)} ₽`} />
        </Card>
      )}

      {show("breakeven") && r.anyChannel && (
        <Card title="Итоги за месяц" icon="TrendingUp">
          <Row label="Выручка · revenue" value={`${money(r.revenuePerMonth)} ₽`} muted />
          {r.bothChannels && (
            <>
              <Row
                label="Валовая прибыль — агрегатор"
                value={`${money(r.agg.profitPerMonth)} ₽`}
                muted
              />
              <Row
                label="Валовая прибыль — своя доставка"
                value={`${money(r.self.profitPerMonth)} ₽`}
                muted
              />
            </>
          )}
          <Row
            label="Валовая прибыль · gross profit"
            value={`${money(r.grossProfitPerMonth)} ₽`}
            strong
          />
          {r.staffTotal > 0 && (
            <Row label="Персонал · payroll" value={`−${money(r.staffTotal)} ₽`} muted />
          )}
          {r.overheadCost > 0 && (
            <Row label="Общие расходы · overhead" value={`−${money(r.overheadCost)} ₽`} muted />
          )}
          {input.fixedPerMonth > 0 && (
            <Row label="Постоянные расходы" value={`−${money(input.fixedPerMonth)} ₽`} muted />
          )}
          {r.itCost > 0 && <Row label="IT-системы" value={`−${money(r.itCost)} ₽`} muted />}
          <Row label="EBITDA" value={`${money(r.ebitda)} ₽`} strong />
          {r.depreciationCost > 0 && (
            <Row
              label="Амортизация · depreciation"
              value={`−${money(r.depreciationCost)} ₽`}
              muted
            />
          )}
          <Row label={r.taxLabel} value={`−${money(r.taxAmount)} ₽`} muted />
          <Row
            label="Чистая прибыль · net profit"
            value={`${money(r.netProfitPerMonth)} ₽`}
            accent
            strong
          />
          <Row label="Рентабельность · net margin" value={percent(r.netMarginPercent)} />
          {r.operatingTotal > 0 && (
            <Row
              label="Заказов в день для выхода в ноль"
              value={r.breakEvenOrders > 0 ? `${money(r.breakEvenOrders)} шт` : "не окупится"}
            />
          )}
          <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.taxNote}</p>
          {r.netProfitPerMonth < 0 && (
            <p className="mt-3 flex gap-2 rounded-xl bg-red-500/15 p-3 text-[0.88em] leading-snug text-red-200">
              <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
              С учётом всех расходов и налогов канал работает в убыток.
            </p>
          )}
        </Card>
      )}

      {show("vat") && r.anyChannel && (
        <Card title="НДС при работе на УСН" icon="Receipt">
          <Row
            label="Выручка за год · annual revenue"
            value={`${money(r.revenuePerYear)} ₽`}
            muted
          />
          <Row label="Ваша ставка НДС" value={r.vat.label} accent />
          {r.vat.rate > 0 && (
            <>
              <Row label="НДС за год" value={`${money(r.vatAmountPerYear)} ₽`} />
              <Row label="НДС в месяц" value={`${money(r.vatAmountPerYear / 12)} ₽`} muted />
            </>
          )}
          {r.daysToVatLimit !== null && (
            <Row label="Лимит будет достигнут через" value={`${money(r.daysToVatLimit)} дн`} muted />
          )}
          {r.ordersToVatLimit !== null && (
            <Row label="Запас до лимита" value={`${money(r.ordersToVatLimit)} заказов`} muted />
          )}
          <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.vat.note}</p>
          <p className="mt-2 flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
            <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
            Важно: в доход считается вся сумма заказа, а не то, что пришло после удержаний. При
            комиссии 35% на счёт поступает примерно половина оборота — а налог считается со всей
            суммы.
          </p>
        </Card>
      )}
    </div>
  );
};

export default CalcOutput;
