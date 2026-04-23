import { NextRequest } from 'next/server'
import { getWrapper, putWrapper } from '@utils/apiWrapper'

export async function GET(
    req: NextRequest,
    context: RouteContext<'/api/system/autoRestart/[id]'>
) {
    const { id } = await context.params
    const response = await getWrapper({
        path: `deployments/${id}`,
        service: 'beekeeper'
    })

    if (typeof response === 'string') {
        return Response.json({ error: response }, { status: 500 })
    }

    return Response.json(response)
}

export async function PUT(
    req: NextRequest,
    context: RouteContext<'/api/system/autoRestart/[id]'>
) {
    try {
        const { id } = await context.params
        const body = await req.json().catch(() => ({}))
        const response = await putWrapper({
            path: `deployments/${id}/auto`,
            service: 'beekeeper',
            data: { enabled: Boolean(body.enabled) }
        })

        if (typeof response === 'string') {
            return Response.json({ error: response }, { status: 500 })
        }

        return Response.json(response)
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Failed to update auto deploy' }, { status: 500 })
    }
}
