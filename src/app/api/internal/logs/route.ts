import { NextRequest } from 'next/server'
import config from '@config'

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('access_token')?.value
        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const base = config.url.internal.replace(/\/$/, '')
        const query = req.nextUrl.searchParams.toString()
        const url = `${base}/docker/logs${query ? `?${query}` : ''}`

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        const text = await response.text()
        return new Response(text, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/json'
            }
        })
    } catch (error) {
        return Response.json({
            error: error instanceof Error ? error.message : 'Failed to proxy logs'
        }, { status: 500 })
    }
}
