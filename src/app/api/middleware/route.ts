import config from '@config'
import { Agent, Dispatcher } from 'undici'

type FetchOptions = RequestInit & {
    dispatcher?: Dispatcher
}

export async function POST(req: Request) {
    try {
        const agent = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        })

        const body = await req.json()
        const { token } = body
        const response = await fetch(`${config.url.API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` },
            agent
        } as FetchOptions)

        if (!response.ok) {
            const errorDescription = `Failed connection to: ${config.url.API_URL}/events: ${await response.text()}`
            console.error(errorDescription)
            return new Response(JSON.stringify({ success: false, error: errorDescription }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch(error) {
        console.error(`API Error: ${JSON.stringify(error)}`)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return new Response(JSON.stringify({ success: false, error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
