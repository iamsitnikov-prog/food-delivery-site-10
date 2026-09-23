import json
import os
import urllib.request
import urllib.parse


def handler(event, context):
    '''
    Принимает заявку с сайта и отправляет её в Telegram.
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

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')

    if not token or not chat_id:
        return {
            'statusCode': 500,
            'headers': cors,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'telegram is not configured'}),
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

    payload = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': '\n'.join(lines),
        'parse_mode': 'HTML',
    }).encode()

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    req = urllib.request.Request(url, data=payload)
    with urllib.request.urlopen(req, timeout=10) as resp:
        resp.read()

    return {
        'statusCode': 200,
        'headers': cors,
        'isBase64Encoded': False,
        'body': json.dumps({'ok': True}),
    }
