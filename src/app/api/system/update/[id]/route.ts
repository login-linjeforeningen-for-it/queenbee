import { NextRequest } from 'next/server'
import { postWrapper } from '@utils/apiWrapper'

export async function POST(
    req: NextRequest,
    context: RouteContext<'/api/system/update/[id]'>
) {
    try {
        const { id } = await context.params
        const response = await postWrapper({
            path: `deployments/${id}/run`,
            service: 'beekeeper',
            data: {}
        })

        if (typeof response === 'string') {
            return Response.json({ error: response }, { status: 500 })
        }

        return Response.json(response)
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Failed to trigger deployment' }, { status: 500 })
    }
}
