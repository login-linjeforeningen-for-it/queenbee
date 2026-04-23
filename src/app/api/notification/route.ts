import sendNotification from '@utils/notification/sendNotification'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, description, screen, topic } = body
        const sent = await sendNotification({ title, description, screen, topic })

        if (!sent) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Failed to send notification',
            }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}
