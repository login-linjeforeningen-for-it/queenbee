import { NextRequest } from 'next/server'
import config from '@config'

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('access_token')?.value
        if (!token) {
            return new Response('Unauthorized', { status: 401 })
        }

        const url = `${config.url.beekeeper}/traffic/live`

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Connection': 'keep-alive',
                'Accept': 'text/event-stream',
            },
        })

        if (!response.ok) {
            return new Response('Failed to connect to traffic service', { status: response.status })
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        })
    } catch (error) {
        console.error(error)
        return new Response('Error proxying traffic live', { status: 500 })
    }
}