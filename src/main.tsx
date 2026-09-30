import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { preloadRouteData } from './lib/route-data'
import './index.css'

const root = document.getElementById("root")!;

// Страница уже отрисована при сборке — «подхватываем» готовую разметку,
// не перерисовывая её. Иначе (например, в редакторе) рисуем с нуля.
if (root.firstElementChild) {
  preloadRouteData(window.location.pathname).finally(() => {
    hydrateRoot(root, <App />);
  });
} else {
  createRoot(root).render(<App />);
}
