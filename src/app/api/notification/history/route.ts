import getNotificationHistory from '@utils/api/app/getNotificationHistory'

export async function GET(req: Request) {
    const limit = Number(new URL(req.url).searchParams.get('limit') || 20)
    const history = await getNotificationHistory(limit)

    if (typeof history === 'string') {
        return Response.json({ error: history }, { status: 500 })
    }

    return Response.json(history)
}
