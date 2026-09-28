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
                env: {...process.env, PRERENDER_OUT_DIR: outDir},
            });

            if (res.status !== 0) {
                console.warn('[prerender] Скрипт завершился с ошибкой — сайт выложится как SPA.');
            }
        } catch (e) {
            console.warn('[prerender] Не удалось выполнить:', (e as Error).message);
            console.warn('[prerender] Сайт выложится как SPA, без готового HTML для поисковиков.');
        } finally {
            if (fs.existsSync(tmp)) fs.rmSync(tmp, {force: true});
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
