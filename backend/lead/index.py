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


def save_lead(name, phone, place, status, channel, comment, sent):
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
            def esc(v):
                return "'" + str(v).replace("'", "''") + "'" if v else 'NULL'
            cur.execute(
                f"INSERT INTO {schema}.leads (name, phone, place, status, channel, comment, sent_to_telegram) "
                f"VALUES ({esc(name)}, {esc(phone)}, {esc(place)}, {esc(status)}, {esc(channel)}, {esc(comment)}, {'TRUE' if sent else 'FALSE'}) "
                f"RETURNING id"
            )
            lead_id = cur.fetchone()[0]
        conn.commit()
        return lead_id
    except Exception as exc:
        print(f'db insert error: {exc}')
        return None
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
            cur.execute(f"UPDATE {schema}.leads SET sent_to_telegram = TRUE WHERE id = {int(lead_id)}")
        conn.commit()
        conn.close()
    except Exception as exc:
        print(f'db update error: {exc}')


def send_telegram(lines, budget=2.2):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return False
    if budget <= 0.3:
        print('telegram skipped: no time budget')
        return False
    payload = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': '\n'.join(lines),
        'parse_mode': 'HTML',
    }).encode()
    targets = list(TG_IPS)
    try:
        for info in socket.getaddrinfo('api.telegram.org', 443, socket.AF_INET, socket.SOCK_STREAM):
            ip = info[4][0]
            if ip not in targets:
                targets.append(ip)
    except Exception as exc:
        print(f'telegram dns error: {exc}')

    deadline = time.monotonic() + budget
    for ip in targets:
        left = deadline - time.monotonic()
        if left <= 0.3:
            print('telegram: time budget exceeded')
            break
        try:
            ctx = ssl.create_default_context()
            raw = socket.create_connection((ip, 443), timeout=min(1.2, left))
            sock = ctx.wrap_socket(raw, server_hostname='api.telegram.org')
            conn = http.client.HTTPSConnection('api.telegram.org', timeout=max(0.5, deadline - time.monotonic()))
            conn.sock = sock
            conn.request('POST', f'/bot{token}/sendMessage', body=payload,
                         headers={'Content-Type': 'application/x-www-form-urlencoded'})
            resp = conn.getresponse()
            ok = resp.status == 200
            print(f'telegram response {resp.status} via {ip}')
            resp.read()
            conn.close()
            if ok:
                return True
        except Exception as exc:
            print(f'telegram error via {ip}: {exc}')
    return False


def handler(event, context):
    '''
    Принимает заявку с сайта, сохраняет её в базу данных и отправляет в Telegram.
    Args: event с httpMethod, body (name, phone, place, status, channel, comment)
    Returns: HTTP ответ со статусом отправки
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
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

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'name and phone are required'}),
        }

    lines = [
        '<b>Новая заявка с сайта</b>',
        '',
        f'<b>Имя:</b> {name}',
        f'<b>Телефон:</b> {phone}',
    ]
    if place:
        lines.append(f'<b>Заведение:</b> {place}')
    if status:
        lines.append(f'<b>Услуга:</b> {status}')
    if channel:
        lines.append(f'<b>Связь:</b> {channel}')
    if comment:
        lines.append(f'<b>Комментарий:</b> {comment}')

    started = time.monotonic()
    total_budget = 4.2

    lead_id = save_lead(name, phone, place, status, channel, comment, False)
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