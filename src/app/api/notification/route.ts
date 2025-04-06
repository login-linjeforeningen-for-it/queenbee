import sendNotification from "@utils/notification/sendNotification"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, description, screen, topic } = body
        await sendNotification({ title, description, screen, topic })
    
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error: any) {
        console.error(`API Error: ${JSON.stringify(error)}`)
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
