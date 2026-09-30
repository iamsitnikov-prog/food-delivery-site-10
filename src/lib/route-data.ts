/**
 * Данные, которые страница обычно подгружает отдельным файлом после открытия
 * (текст статьи, термин, карточки глоссария). Для заранее отрисованной
 * страницы их нужно загрузить до отрисовки — и на сервере, и в браузере
 * перед «подхватом» разметки, иначе браузер увидит «загрузку» вместо текста
 * и перерисует страницу.
 *
 * Модули данных подключаются динамически, чтобы не утяжелять основной скрипт.
 */
export const preloadRouteData = async (pathname: string) => {
  const [, section, slug] = pathname.split("/");
  try {
    if (section === "blog" && slug) {
      const { loadPost } = await import("@/data/post-index");
      await loadPost(slug);
    } else if (section === "slovar") {
      const { loadTerm, loadTermCards } = await import("@/data/term-index");
      if (slug) await loadTerm(slug);
      else await loadTermCards();
    }
  } catch {
    // Нет данных — страница покажет обычную загрузку.
  }
};
