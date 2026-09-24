import type { ChecklistPage } from "@/data/checklists";
import { READ_CHANNELS } from "@/data/channels";

const DARK = "#1B0F0B";

const ChecklistPrint = ({ page }: { page: ChecklistPage }) => (
  <div
    id="checklist-print"
    style={{ display: "none", color: DARK, fontSize: 12, lineHeight: 1.35 }}
  >
    <div style={{ borderBottom: `2px solid ${DARK}`, paddingBottom: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{page.h1}</div>
      <div style={{ fontSize: 11, marginTop: 4 }}>{page.lead}</div>
      <div style={{ fontSize: 10, marginTop: 6 }}>
        agregatory.pro · +7 931 002-82-22 · продвижение ресторанов на агрегаторах
      </div>
    </div>

    {page.groups.map((group) => (
      <div key={group.title} style={{ marginBottom: 14, breakInside: "avoid" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 6,
            borderBottom: `1px solid ${DARK}`,
            paddingBottom: 3,
          }}
        >
          {group.title}
        </div>
        {group.items.map((item) => (
          <div
            key={item.text}
            style={{ display: "flex", gap: 7, marginBottom: 5, breakInside: "avoid" }}
          >
            <span
              style={{
                display: "inline-block",
                width: 11,
                height: 11,
                border: `1.5px solid ${DARK}`,
                borderRadius: 2,
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <span>
              {item.text}
              {item.hint && (
                <span style={{ display: "block", fontSize: 10, opacity: 0.7, marginTop: 1 }}>
                  {item.hint}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    ))}

    <div
      style={{
        marginTop: 16,
        paddingTop: 10,
        borderTop: `2px solid ${DARK}`,
        breakInside: "avoid",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
        Пишем о доставке каждый день
      </div>
      {READ_CHANNELS.map((c) => (
        <div key={c.id} style={{ fontSize: 10.5, marginBottom: 3 }}>
          <b>{c.label}</b> — {c.short}
          <span style={{ display: "block", opacity: 0.75 }}>{c.href}</span>
        </div>
      ))}
      <div style={{ fontSize: 10, marginTop: 8, opacity: 0.8 }}>
        Бесплатный разбор вашего заведения — agregatory.pro
      </div>
    </div>
  </div>
);

export default ChecklistPrint;
