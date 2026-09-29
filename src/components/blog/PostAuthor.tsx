import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PEOPLE, COURSE } from "@/data/team";

const PostAuthor = () => (
  <aside className="mt-8 md:mt-14 rounded-[28px] bg-pale p-4 md:p-9">
    <div className="text-[0.8em] font-medium uppercase tracking-wide text-foreground/55">
      материал подготовили
    </div>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      {PEOPLE.map((p) => (
        <div key={p.name} className="flex items-start gap-3 md:gap-4">
          <img
            src={p.photo}
            alt={`${p.name} — эксперт по продвижению ресторанов на Яндекс Еде`}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 shrink-0 rounded-full border-2 border-foreground/15 object-cover object-top"
          />
          <div className="min-w-0">
            <div className="font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">
              {p.name}
            </div>
            <div className="mt-1 text-[0.82em] text-foreground/55">{p.exp}</div>
            <p className="mt-2.5 text-[0.88em] leading-snug text-foreground/75">{p.role}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-7 flex flex-col gap-3 md:gap-4 border-t border-foreground/15 pt-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <Icon name="GraduationCap" size={22} className="mt-0.5 shrink-0 text-foreground/70" />
        <div className="text-[0.9em] leading-snug text-foreground/75">
          Создатели и соавторы курса{" "}
          <span className="font-medium text-foreground">{COURSE}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-5 text-[0.85em] text-foreground/55">
        <Link to="/#team" className="underline underline-offset-4 hover:text-foreground">
          о нас
        </Link>
      </div>
    </div>
  </aside>
);

export default PostAuthor;