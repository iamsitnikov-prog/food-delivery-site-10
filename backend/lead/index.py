import html
import http.client
import json
import os
import smtplib
import socket
import ssl
import time
import urllib.parse
from email.message import EmailMessage

import psycopg2

TG_IPS = [
    '149.154.167.220',
    '149.154.167.99',
    '149.154.175.50',
    '91.108.56.130',
    '149.154.171.5',
]


def send_email(subject, text, budget=2.0):
    host = os.environ.get('SMTP_HOST')
    user = os.environ.get('SMTP_USER')
    password = os.environ.get('SMTP_PASSWORD')
    to = os.environ.get('LEAD_EMAIL_TO')
    if not host or not user or not password or not to:
        return False
    if budget <= 0.3:
        print('email skipped: no time budget')
        return False
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to
    msg.set_content(text)
    try:
        with smtplib.SMTP_SSL(host, 465, timeout=budget) as s:
            s.login(user, password)
            s.send_message(msg)
        return True
    except Exception as exc:
        print(f'email error: {exc}')
        return False


def save_lead(name, phone, place, status, channel, comment, sent, page='', ip=''):
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return None
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    try:
        conn = psycopg2.connect(dsn, connect_timeout=3)
    except Exception as exc:
        print(f'db connect error: {exc}')
        return None
    try:
        with conn.cursor() as cur:
            cur.execute(
                f'INSERT INTO {schema}.leads '
                '(name, phone, place, status, channel, comment, sent_to_telegram, page, ip) '
                'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id',
                (
                    name or None,
                    phone or None,
                    place or None,
                    status or None,
                    channel or None,
                    comment or None,
                    bool(sent),
                    page or None,
                    ip or None,
                ),
            )
            lead_id = cur.fetchone()[0]
        conn.commit()
        return lead_id
    except Exception as exc:
        print(f'db insert error: {exc}')
        return None
    finally:
        conn.close()


def too_many_from_ip(ip, limit=3, minutes=10):
    """Больше limit заявок с одного адреса за minutes минут — это уже не человек."""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn or not ip:
        return False
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    try:
        conn = psycopg2.connect(dsn, connect_timeout=2)
    except Exception as exc:
        print(f'db connect error: {exc}')
        return False
    try:
        with conn.cursor() as cur:
            cur.execute(
                f'SELECT count(*) FROM {schema}.leads '
                'WHERE ip = %s AND created_at > now() - make_interval(mins => %s)',
                (ip, minutes),
            )
            recent = cur.fetchone()[0]
        return recent >= limit
    except Exception as exc:
        print(f'db rate check error: {exc}')
        return False
    finally:
        conn.close()


def mark_sent(lead_id):
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    try:
        conn = psycopg2.connect(dsn, connect_timeout=2)
        with conn.cursor() as cur:
            cur.execute(
                f'UPDATE {schema}.leads SET sent_to_telegram = TRUE WHERE id = %s',
                (int(lead_id),),
            )
        conn.commit()
        conn.close()
    except Exception as exc:
        print(f'db update error: {exc}')


def send_telegram(lines, budget=2.2):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    raw_chats = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not raw_chats:
        return False
    # В TELEGRAM_CHAT_ID можно указать несколько чатов через запятую —
    # заявка уходит в каждый из них.
    chat_ids = [c.strip() for c in raw_chats.split(',') if c.strip()]
    if not chat_ids:
        return False
    if budget <= 0.3:
        print('telegram skipped: no time budget')
        return False
    text = '\n'.join(lines)
    payloads = [
        (chat, urllib.parse.urlencode({
            'chat_id': chat,
            'text': text,
            'parse_mode': 'HTML',
        }).encode())
        for chat in chat_ids
    ]
    targets = list(TG_IPS)
    try:
        for info in socket.getaddrinfo('api.telegram.org', 443, socket.AF_INET, socket.SOCK_STREAM):
            ip = info[4][0]
            if ip not in targets:
                targets.append(ip)
    except Exception as exc:
        print(f'telegram dns error: {exc}')

    deadline = time.monotonic() + budget
    pending = list(payloads)
    delivered = []
    for ip in targets:
        if not pending:
            break
        left = deadline - time.monotonic()
        if left <= 0.3:
            print('telegram: time budget exceeded')
            break
        conn = None
        try:
            ctx = ssl.create_default_context()
            raw = socket.create_connection((ip, 443), timeout=min(1.2, left))
            sock = ctx.wrap_socket(raw, server_hostname='api.telegram.org')
            conn = http.client.HTTPSConnection('api.telegram.org', timeout=max(0.5, deadline - time.monotonic()))
            conn.sock = sock
            # Один дозвонившийся адрес обслуживает все чаты — новое соединение
            # на каждый чат не укладывается в бюджет времени функции.
            for chat, payload in list(pending):
                if deadline - time.monotonic() <= 0.2:
                    print('telegram: time budget exceeded')
                    break
                conn.request('POST', f'/bot{token}/sendMessage', body=payload,
                             headers={'Content-Type': 'application/x-www-form-urlencoded'})
                resp = conn.getresponse()
                print(f'telegram response {resp.status} for chat {chat} via {ip}')
                resp.read()
                if resp.status == 200:
                    delivered.append(chat)
                    pending = [p for p in pending if p[0] != chat]
                elif 400 <= resp.status < 500:
                    # Чат недоступен боту — другой IP не поможет, не тратим время
                    pending = [p for p in pending if p[0] != chat]
        except Exception as exc:
            print(f'telegram error via {ip}: {exc}')
        finally:
            if conn is not None:
                try:
                    conn.close()
                except Exception:
                    pass
    print(f'telegram delivered to {len(delivered)} of {len(payloads)} chats')
    return bool(delivered)


ALLOWED_ORIGINS = (
    'https://agregatory.pro',
    'https://www.agregatory.pro',
)

# Предпросмотр внутри редактора платформы — поддомены poehali.dev.
PREVIEW_SUFFIXES = ('.poehali.dev',)


def pick_origin(headers):
    """Отдаём разрешение только своему домену и предпросмотру платформы."""
    origin = ''
    for k, v in (headers or {}).items():
        if k.lower() == 'origin':
            origin = (v or '').strip()
            break
    if origin in ALLOWED_ORIGINS:
        return origin
    host = origin.split('//')[-1].split('/')[0].split(':')[0]
    if origin.startswith('https://') and host.endswith(PREVIEW_SUFFIXES):
        return origin
    return ALLOWED_ORIGINS[0]


def handler(event, context):
    '''
    Принимает заявку с сайта, сохраняет её в базу данных и отправляет в Telegram.
    Args: event с httpMethod, body (name, phone, place, status, channel, comment)
    Returns: HTTP ответ со статусом отправки
    '''
    method = event.get('httpMethod', 'GET')
    allow_origin = pick_origin(event.get('headers'))

    cors = {
        'Access-Control-Allow-Origin': allow_origin,
        'Vary': 'Origin',
        'Content-Type': 'application/json',
    }

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': allow_origin,
                'Vary': 'Origin',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'isBase64Encoded': False,
            'body': '',
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    name = str(body.get('name', '')).strip()
    phone = str(body.get('phone', '')).strip()
    place = str(body.get('place', '')).strip()
    status = str(body.get('status', '')).strip()
    channel = str(body.get('channel', '')).strip()
    comment = str(body.get('comment', '')).strip()
    page = str(body.get('page', '')).strip()[:300]
    trap = str(body.get('website', '')).strip()

    # Скрытое поле-ловушка: человек его не видит и не заполняет, робот заполняет.
    # Отвечаем как при успехе, чтобы бот не искал обход, но ничего не отправляем.
    if trap:
        print('lead rejected: honeypot filled')
        return {
            'statusCode': 200,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'ok': True}),
        }

    ip = str(
        (event.get('requestContext') or {}).get('identity', {}).get('sourceIp') or ''
    ).strip()[:64]

    if too_many_from_ip(ip):
        print(f'lead rejected: rate limit for {ip}')
        return {
            'statusCode': 429,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'too many requests'}),
        }

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'name and phone are required'}),
        }

    # Сообщение уходит с parse_mode=HTML — экранируем, чтобы < и & в тексте
    # не ломали отправку.
    esc = lambda v: html.escape(v, quote=False)

    lines = [
        '<b>Новая заявка с сайта</b>',
        '',
        f'<b>Имя:</b> {esc(name)}',
        f'<b>Телефон:</b> {esc(phone)}',
    ]
    if place:
        lines.append(f'<b>Заведение:</b> {esc(place)}')
    if status:
        lines.append(f'<b>Услуга:</b> {esc(status)}')
    if channel:
        lines.append(f'<b>Связь:</b> {esc(channel)}')
    if comment:
        lines.append(f'<b>Комментарий:</b> {esc(comment)}')
    if page.startswith('http'):
        lines.append(f'<b>Страница:</b> {esc(page)}')

    started = time.monotonic()
    total_budget = 4.2

    lead_id = save_lead(name, phone, place, status, channel, comment, False, page, ip)
    plain = '\n'.join(l.replace('<b>', '').replace('</b>', '') for l in lines)

    left = total_budget - (time.monotonic() - started)
    sent = send_telegram(lines, budget=min(2.2, left))

    left = total_budget - (time.monotonic() - started)
    mailed = send_email(f'Заявка с сайта: {name}', plain, budget=left)

    if sent and lead_id:
        mark_sent(lead_id)

    if not mailed and not sent and not lead_id:
        print(f'LEAD LOST: {plain}')
        return {
            'statusCode': 502,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'ok': False, 'error': 'delivery failed'}),
        }

    if not mailed and not sent:
        print(f'LEAD SAVED BUT NOT DELIVERED id={lead_id}')

    return {
        'statusCode': 200,
        'headers': cors,
        'isBase64Encoded': False,
        'body': json.dumps({'ok': True, 'id': lead_id, 'telegram': sent, 'email': mailed}),
    }