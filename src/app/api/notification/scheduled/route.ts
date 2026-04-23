import getScheduledNotifications from '@utils/api/app/getScheduledNotifications'
import postScheduledNotification from '@utils/api/app/postScheduledNotification'

export async function GET(req: Request) {
    const limit = Number(new URL(req.url).searchParams.get('limit') || 20)
    const scheduled = await getScheduledNotifications(limit)

    if (typeof scheduled === 'string') {
        return Response.json({ error: scheduled }, { status: 500 })
    }

    return Response.json(scheduled)
}

export async function POST(req: Request) {
    const body = await req.json()
    const scheduled = await postScheduledNotification(body)

    if (typeof scheduled === 'string') {
        return Response.json({ error: scheduled }, { status: 500 })
    }

    return Response.json(scheduled)
}
