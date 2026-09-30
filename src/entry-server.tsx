/**
 * Отрисовка страниц заранее, при сборке (server-side rendering).
 *
 * Раньше в HTML лежал упрощённый текст для поисковиков, а сам сайт появлялся
 * только после загрузки скриптов — на мобильном это 3–4 секунды пустого
 * экрана. Теперь при сборке каждая страница рендерится тем же React-кодом,
 * что и в браузере, и готовая разметка кладётся в #root. Браузер сразу
 * показывает страницу, а скрипт потом «подхватывает» её (hydrateRoot)
 * без перерисовки.
 *
 * Используется только в scripts/prerender.ts, в браузер не попадает.
 */
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";
import { preloadRouteData } from "./lib/route-data";

// Граница Suspense, которая не дождалась кода (lazy) и отдала заглушку.
const PENDING = "<!--$!-->";

export const render = async (url: string): Promise<string> => {
  await preloadRouteData(url);

  const Router = ({ children }: { children: ReactNode }) => (
    <StaticRouter location={url}>{children}</StaticRouter>
  );

  // Страницы грузятся отдельными файлами (lazy). Первый проход запускает их
  // загрузку и отдаёт заглушку; когда файлы загружены, следующий проход
  // рисует страницу целиком. Потоковый рендер тут не годится: в React 18 он
  // портит русские буквы на стыке кусков (вставляет нулевой байт).
  let html = "";
  for (let pass = 0; pass < 8; pass++) {
    html = renderToString(<AppShell Router={Router} />);
    if (!html.includes(PENDING)) return html;
    await new Promise((r) => setTimeout(r, 25));
  }
  throw new Error(`страница не дорисовалась: ${url}`);
};
