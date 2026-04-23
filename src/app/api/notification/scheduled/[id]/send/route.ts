import sendScheduledNotification from '@utils/api/app/sendScheduledNotification'

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const sent = await sendScheduledNotification(id)

    if (typeof sent === 'string') {
        return Response.json({ error: sent }, { status: 500 })
    }

    return Response.json(sent)
}
