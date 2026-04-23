import resendNotification from '@utils/api/app/resendNotification'

export async function POST(_: Request, context: RouteContext<'/api/notification/resend/[id]'>) {
    const { id } = await context.params
    const resent = await resendNotification(id)

    if (typeof resent === 'string') {
        return Response.json({ error: resent }, { status: 500 })
    }

    return Response.json(resent)
}
