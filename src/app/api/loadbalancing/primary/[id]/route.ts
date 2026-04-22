import { NextRequest } from 'next/server'
import config from '@config'

export async function POST(req: NextRequest, context: RouteContext<'/api/loadbalancing/primary/[id]'>) {
    try {
        const token = req.cookies.get('access_token')?.value
        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await context.params
        const response = await fetch(`${config.url.beekeeper}/site/primary/${id}`, {
            method: 'GET',
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
        return Response.json({ error: 'Failed to switch primary site' }, { status: 500 })
    }
}
