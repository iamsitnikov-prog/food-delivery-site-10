import { useEffect, useState } from "react";

/**
 * Какой раздел статьи сейчас перед глазами — для подсветки в оглавлении.
 * Активным считаем последний заголовок, который ушёл выше линии чтения.
 */
export const useActiveAnchor = (ids: string[]) => {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;

    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      // В самом низу страницы последний раздел может так и не дойти
      // до линии — подсвечиваем его принудительно.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (atBottom) current = ids[ids.length - 1];

      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return active;
};
