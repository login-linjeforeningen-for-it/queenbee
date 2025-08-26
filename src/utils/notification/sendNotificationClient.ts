type HandleSendProps = {
    title: string
    description: string
    screen: string
    topic: string
}

export default async function sendNotificationClient({title, description, screen, topic}: HandleSendProps): Promise<SendResponseClient> {
    try {
        const res = await fetch('/api/notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                screen: { id: screen },
                topic,
            })
        })
        const data = await res.json()
        if (data.success) {
            return {
                status: 200,
                message: 'Notification sent!'
            }
        } else {
            return {
                status: 500,
                message: `Error sending notification: ${JSON.stringify(data.error)}`
            }
        }
    } catch(err) {
        return {
            status: 500,
            message: `Request failed: ${JSON.stringify(err)}`
        }
    }
}
