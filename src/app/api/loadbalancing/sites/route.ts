import { NextRequest } from 'next/server'
import config from '@config'

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('access_token')?.value
        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const response = await fetch(`${config.url.beekeeper}/sites`, {
            headers: {
                Authorization: `Bearer ${token}`
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
        console.error(error)
        return Response.json({ error: 'Failed to load sites' }, { status: 500 })
    }
}
