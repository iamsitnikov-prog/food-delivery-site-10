import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {componentTagger} from "pp-tagger";
import {spawnSync} from "node:child_process";
import fs from "node:fs";

// Пререндер статических страниц после сборки.
// Работает внутри Vite (closeBundle), поэтому не зависит от того, какую
// npm-команду запускает платформа деплоя.
//
// TypeScript-скрипт компилируем через esbuild — он входит в зависимости Vite
// и потому есть на сборочном сервере всегда (в отличие от tsx, который лежал
// в devDependencies и на деплое не устанавливался).
//
// Сбой пререндера не роняет билд: без него сайт остаётся рабочим SPA.
const prerenderPlugin = {
    name: 'prerender-static-pages',
    apply: 'build' as const,
    async closeBundle() {
        // Внутренняя серверная сборка (ниже) — пререндер в ней не запускаем.
        if (process.env.PP_SSR_BUILD) return;

        const outDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(outDir)) {
            console.warn('[prerender] dist не найден — пропускаю.');
            return;
        }

        const entry = path.resolve(__dirname, 'scripts/prerender.ts');
        if (!fs.existsSync(entry)) {
            console.warn('[prerender] scripts/prerender.ts не найден — пропускаю.');
            return;
        }

        const tmp = path.resolve(__dirname, 'node_modules/.prerender-build.mjs');

        // Серверная сборка страниц: тот же React-код, но для Node. Пререндер
        // отрисовывает им каждую страницу в готовую разметку. Если сборка
        // не удалась, пререндер работает по-старому (текст для поисковиков,
        // сайт рисуется в браузере) — выкладка не ломается.
        const ssrOut = path.resolve(__dirname, 'node_modules/.ssr-build');
        let ssrEntry = '';
        try {
            process.env.PP_SSR_BUILD = '1';
            const vite = await import('vite');
            await vite.build({
                configFile: path.resolve(__dirname, 'vite.config.ts'),
                mode: 'production',
                logLevel: 'warn',
                build: {
                    ssr: path.resolve(__dirname, 'src/entry-server.tsx'),
                    outDir: ssrOut,
                    emptyOutDir: true,
                    copyPublicDir: false,
                    rollupOptions: {output: {entryFileNames: 'entry-server.mjs', format: 'esm'}},
                },
            });
            const built = path.join(ssrOut, 'entry-server.mjs');
            if (fs.existsSync(built)) ssrEntry = built;
        } catch (e) {
            console.warn('[prerender] Серверная сборка не удалась, страницы будут без готовой разметки:', (e as Error).message);
        } finally {
            delete process.env.PP_SSR_BUILD;
        }

        try {
            const esbuild = await import('esbuild');
            await esbuild.build({
                entryPoints: [entry],
                bundle: true,
                platform: 'node',
                target: 'node18',
                format: 'esm',
                outfile: tmp,
                packages: 'external',
                logLevel: 'silent',
                alias: {'@': path.resolve(__dirname, 'src')},
            });

            const res = spawnSync(process.execPath, [tmp], {
                stdio: 'inherit',
                cwd: __dirname,
                env: {...process.env, PRERENDER_OUT_DIR: outDir, PRERENDER_SSR_ENTRY: ssrEntry},
            });

            if (res.status !== 0) {
                console.warn('[prerender] Скрипт завершился с ошибкой — сайт выложится как SPA.');
            }
        } catch (e) {
            console.warn('[prerender] Не удалось выполнить:', (e as Error).message);
            console.warn('[prerender] Сайт выложится как SPA, без готового HTML для поисковиков.');
        } finally {
            if (fs.existsSync(tmp)) fs.rmSync(tmp, {force: true});
            if (fs.existsSync(ssrOut)) fs.rmSync(ssrOut, {recursive: true, force: true});
        }
    },
};

// DDoS Guard требует двусторонний app-level keepalive чаще 30s.
// Сервер: text-frame {type:'ping'} каждые 5-9s (рандом — чтобы DDoS Guard
// не триггерился на одинаковые интервалы; Vite-клиент игнорирует, case "ping": break;).
// Клиент: server.hmr.timeout = 7000 ниже понижает pingInterval @vite/client до 7s.
const hmrKeepalive = {
    name: 'hmr-ws-keepalive',
    configureServer(server: any) {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const tick = () => {
            server.ws?.send({type: 'ping'});
            timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
        };
        timer = setTimeout(tick, 5000 + Math.floor(Math.random() * 4000));
        server.httpServer?.on('close', () => {
            if (timer) clearTimeout(timer);
        });
    },
};

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [
        react(),
        hmrKeepalive,
        prerenderPlugin,
        mode === 'development' &&
        componentTagger(),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        target: ["es2019", "safari13", "chrome79", "firefox78", "edge79"],
        // Отделяем редко используемое от того, что нужно на первом экране.
        // Иначе React, интерфейсные компоненты и разбор отчётов едут одним
        // файлом на 605 КБ, и текст ждёт загрузки всего сразу.
        rollupOptions: {
            output: {
                // В серверной сборке (пререндер страниц) деление на чанки не нужно.
                manualChunks: process.env.PP_SSR_BUILD ? undefined : (id: string) => {
                    if (!id.includes("node_modules")) return;
                    // xlsx, pdf и подобное нужны только на странице разбора
                    // отчётов. Оставляем их отдельными файлами, которые
                    // подгружаются по требованию, а не на первом экране.
                    if (/xlsx|pdfjs|jspdf|html2canvas|papaparse/.test(id)) return;
                    if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)/.test(id))
                        return "react";
                    if (id.includes("@radix-ui")) return "ui";
                    if (id.includes("lucide-react")) return "icons";
                    return "vendor";
                },
            },
        },
    },
    esbuild: {
        target: "es2019",
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: true,
        hmr: {
            overlay: false, // Disables the error overlay if you only want console errors
            timeout: 7000, // pingInterval @vite/client — нужен <30s для DDoS Guard
        }
    },
}));
