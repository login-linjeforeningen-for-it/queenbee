import { NextRequest } from 'next/server'
import { getWrapper } from '@utils/apiWrapper'

export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams.toString()
        const response = await getWrapper({
            path: query ? `docker/logs?${query}` : 'docker/logs',
            service: 'beekeeper',
            options: {
                cache: 'no-store',
            }
        })

        if (typeof response === 'string') {
            return Response.json({ error: response }, { status: 500 })
        }

        return Response.json(response)
    } catch (error) {
        return Response.json({
            error: error instanceof Error ? error.message : 'Failed to proxy logs'
        }, { status: 500 })
    }
}
