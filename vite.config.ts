import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {componentTagger} from "pp-tagger";
import {spawnSync} from "node:child_process";
import fs from "node:fs";

// Пререндер статических страниц после сборки.
// Выполняется внутри Vite (closeBundle), поэтому не зависит от того,
// какую именно npm-команду запускает платформа деплоя.
// Сбой пререндера не должен ронять билд: без него сайт остаётся рабочим SPA.
const prerenderPlugin = {
    name: 'prerender-static-pages',
    apply: 'build' as const,
    closeBundle() {
        const outDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(outDir)) {
            console.warn('[prerender] dist не найден — пропускаю.');
            return;
        }
        const tsxCli = path.resolve(__dirname, 'node_modules/tsx/dist/cli.mjs');
        if (!fs.existsSync(tsxCli)) {
            console.warn('[prerender] tsx не установлен — пропускаю, сайт соберётся как SPA.');
            return;
        }
        const res = spawnSync(process.execPath, [tsxCli, 'scripts/prerender.ts'], {
            stdio: 'inherit',
            cwd: __dirname,
            env: {...process.env, PRERENDER_OUT_DIR: outDir},
        });
        if (res.status !== 0) {
            console.warn('[prerender] Не отработал — сайт выложится как SPA.');
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
