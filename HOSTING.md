# Настройка хостинга: 404 и редиректы

Что нужно включить на стороне сервера, чтобы закрыть пункт 1.3 из ТЗ.
Файлы со стороны сайта уже готовы: `404.html`, `sitemap.xml`, `robots.txt`
лежат в корне собранной папки `dist`.

---

## 1. Код 404 для несуществующих адресов

**Что сейчас.** Сервер отдаёт `index.html` на любой адрес с кодом `200`.
Поисковик считает несуществующие страницы нормальными и тащит их в индекс.

**Что нужно.** Если файл по адресу не найден — отдать `/404.html` с кодом `404`.

**Важно:** не просто `404.html`, а именно с кодом ответа `404`. Многие
конфигурации по привычке отдают его с кодом `200` — это та же ошибка.

### Nginx

```nginx
server {
    root /var/www/agregatory/dist;
    index index.html;

    # Статика: год кеша, имена файлов с хешем
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Служебные файлы отдаём как есть
    location = /sitemap.xml { expires 1h; }
    location = /robots.txt  { expires 1h; }
    location = /rss.xml     { expires 1h; }

    # Готовые страницы пререндера: /uslugi/snizhenie-drr/index.html
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # Своя страница 404 — именно с кодом 404
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

### Apache (.htaccess)

```apache
Options -MultiViews
ErrorDocument 404 /404.html

RewriteEngine On

# Существующие файлы и папки отдаём напрямую
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Готовая страница пререндера
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^(.*?)/?$ /$1/index.html [L]

# Всё остальное — 404, а НЕ index.html
RewriteRule ^ - [R=404,L]

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
```

### Если хостинг из коробки отдаёт SPA-fallback

У панелей вроде Vercel, Netlify и подобных обычно включено правило
«всё на index.html». Его нужно **выключить** или сузить, иначе 404 не заработает.

`netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

`vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

При `cleanUrls` Vercel сам находит `/uslugi/snizhenie-drr/index.html`
и отдаёт 404 для остального — отдельное правило не нужно.

---

## 2. Одна главная версия адреса

Нужен один канонический вид: `https://agregatory.pro` — без `www`.
Все остальные варианты должны переносить на него **кодом 301**, а не 302:
302 означает «временно» и вес страницы не передаёт.

### Nginx

```nginx
# http без www  → https без www
server {
    listen 80;
    server_name agregatory.pro www.agregatory.pro;
    return 301 https://agregatory.pro$request_uri;
}

# https с www → https без www
server {
    listen 443 ssl http2;
    server_name www.agregatory.pro;
    # ssl_certificate ...;
    return 301 https://agregatory.pro$request_uri;
}
```

### Apache (.htaccess, в начало файла)

```apache
RewriteEngine On

RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^(.*)$ https://agregatory.pro/$1 [R=301,L]
```

---

## 3. Слеш в конце адреса

Сайт использует адреса **без завершающего слеша**: `/uslugi/snizhenie-drr`.
Именно так они записаны в `sitemap.xml` и в canonical на страницах.
Вариант со слешем должен переносить на основной кодом 301.

### Nginx

```nginx
# /uslugi/snizhenie-drr/ → /uslugi/snizhenie-drr
rewrite ^/(.*)/$ /$1 permanent;
```

Правило ставится до блока `location /`. Корень `/` не затрагивается.

### Apache

```apache
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [R=301,L]
```

---

## 4. Проверка после настройки

Команды из раздела «Приёмка» в ТЗ. Все должны отработать так, как указано.

```bash
# 1. У страницы свой title, h1 и canonical на себя — без JavaScript
curl -s https://agregatory.pro/uslugi/snizhenie-drr | grep -iE '<title>|<h1|rel="canonical"'
# ожидаем: title и h1 про снижение ДРР, canonical на этот же адрес

# 2. Несуществующий адрес отвечает 404
curl -s -o /dev/null -w '%{http_code}\n' https://agregatory.pro/net-takoy-stranicy-123
# ожидаем: 404

curl -s -o /dev/null -w '%{http_code}\n' https://agregatory.pro/uslugi/net-takoy-123
# ожидаем: 404

# 3. Редиректы 301 на основную версию
curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' http://agregatory.pro/
curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' https://www.agregatory.pro/
curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' https://agregatory.pro/uslugi/
# ожидаем во всех трёх: 301 и адрес без www, по https, без слеша в конце

# 4. Главная страница отвечает 200
curl -s -o /dev/null -w '%{http_code}\n' https://agregatory.pro/
# ожидаем: 200

# 5. sitemap и robots доступны
curl -s -o /dev/null -w '%{http_code}\n' https://agregatory.pro/sitemap.xml
curl -s -o /dev/null -w '%{http_code}\n' https://agregatory.pro/robots.txt
# ожидаем: 200 и 200

# 6. Разные страницы отдают разный HTML (а не один шаблон)
for u in / /uslugi/snizhenie-drr /goroda/moskva /kalkulyatory/drr /slovar/gmv; do
  printf '%-32s %s байт\n' "$u" "$(curl -s https://agregatory.pro$u | wc -c)"
done
# ожидаем: размеры заметно различаются
```

---

## 5. Порядок выкладки

1. Собрать проект: `npm run build` — в `dist` появятся 259 страниц,
   `sitemap.xml`, `robots.txt` и `404.html`.
2. Выложить содержимое `dist` в корень сайта.
3. Применить конфигурацию из пунктов 1–3 и перезапустить веб-сервер.
4. Прогнать проверки из пункта 4.
5. В Яндекс Вебмастере и Google Search Console:
   - «Проверка ответа сервера» для 3–4 внутренних страниц — должен
     отображаться их собственный контент, а не главная;
   - переотправить `sitemap.xml`;
   - отправить на переобход главные страницы: главную, услуги, города,
     калькуляторы, глоссарий.

---

## Что уже готово со стороны сайта

| Пункт ТЗ | Состояние |
|---|---|
| 1.1 Полный HTML с первого ответа | 259 страниц пререндерятся при сборке |
| 1.2 Уникальные метатеги | У каждой страницы свои title, description, h1, canonical, Open Graph |
| 1.3 Страница 404 | `404.html` с `noindex`, без canonical, со ссылками на разделы |
| 1.3 Редиректы | **Требуется настройка хостинга** (пункты 2 и 3 выше) |
| 1.4 sitemap.xml | 259 адресов с `lastmod`, генерируется при каждой сборке |
| 1.4 robots.txt | Sitemap, Clean-param для Яндекса, служебные разделы закрыты |
| 2.1 Микроразметка | 10 типов Schema.org, отзывы и рейтинги убраны |
| 2.2 Перелинковка | Обычные ссылки, хлебные крошки, города и услуги в подвале |
