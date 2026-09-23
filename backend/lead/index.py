import http.client
import json
import os
import socket
import ssl
import urllib.parse

import psycopg2

TG_IPS = ['149.154.167.220']


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


def send_telegram(lines):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return False
    payload = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': '\n'.join(lines),
        'parse_mode': 'HTML',
    }).encode()
    for ip in TG_IPS:
        try:
            ctx = ssl.create_default_context()
            raw = socket.create_connection((ip, 443), timeout=2)
            sock = ctx.wrap_socket(raw, server_hostname='api.telegram.org')
            conn = http.client.HTTPSConnection('api.telegram.org', timeout=3)
            conn.sock = sock
            conn.request('POST', f'/bot{token}/sendMessage', body=payload,
                         headers={'Content-Type': 'application/x-www-form-urlencoded'})
            resp = conn.getresponse()
            ok = resp.status == 200
            print(f'telegram response {resp.status}: {resp.read()[:300].decode(errors="ignore")}')
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

    sent = send_telegram(lines)
    lead_id = save_lead(name, phone, place, status, channel, comment, sent)

    return {
        'statusCode': 200,
        'headers': cors,
        'isBase64Encoded': False,
        'body': json.dumps({'ok': True, 'id': lead_id, 'telegram': sent}),
    }