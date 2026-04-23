import deleteScheduledNotification from '@utils/api/app/deleteScheduledNotification'

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const removed = await deleteScheduledNotification(id)

    if (typeof removed === 'string') {
        return Response.json({ error: removed }, { status: 500 })
    }

    return Response.json(removed)
}
