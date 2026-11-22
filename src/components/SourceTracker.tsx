import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureTouch, trackPage } from "@/lib/attribution";

// Запоминает, откуда пришёл посетитель и какие страницы открыл (src/lib/attribution.ts).
// Ничего не рисует.
let captured = false;
const SourceTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!captured) {
      captured = true;
      captureTouch();
    }
    trackPage(pathname);
  }, [pathname]);
  return null;
};

export default SourceTracker;
