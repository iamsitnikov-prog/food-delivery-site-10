import json
import os
import re
from typing import Dict, Any

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}

SLUG_RE = re.compile(r'^[a-z0-9-]{1,160}$')


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Счётчик отметок «Полезно» под статьями блога: GET — получить, POST — добавить."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True

    try:
        cur = conn.cursor()

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            raw = params.get('slugs') or ''
            slugs = [s for s in raw.split(',') if SLUG_RE.match(s)][:60]

            result: Dict[str, int] = {}
            if slugs:
                values = ','.join("'" + s + "'" for s in slugs)
                cur.execute(f'SELECT slug, likes FROM post_reactions WHERE slug IN ({values})')
                for row in cur.fetchall():
                    result[row[0]] = row[1]

            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'likes': result}),
            }

        body = json.loads(event.get('body') or '{}')
        slug = str(body.get('slug', ''))

        if not SLUG_RE.match(slug):
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'bad slug'}),
            }

        cur.execute(
            "INSERT INTO post_reactions (slug, likes) VALUES ('"
            + slug
            + "', 1) ON CONFLICT (slug) DO UPDATE SET likes = post_reactions.likes + 1, "
            "updated_at = NOW() RETURNING likes"
        )
        likes = cur.fetchone()[0]

        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'slug': slug, 'likes': likes}),
        }
    finally:
        conn.close()
