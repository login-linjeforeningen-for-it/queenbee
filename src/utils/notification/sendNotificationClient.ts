type HandleSendProps = {
    title: string
    description: string
    screen: string
    topic: string
}

function normalizeScreenPayload(screen: string) {
    const value = screen.trim()
    if (!value) {
        return {}
    }

    const lower = value.toLowerCase()
    if (lower.startsWith('event:')) {
        return {
            target: 'event',
            id: value.split(':')[1] || '',
        }
    }

    if (lower.startsWith('ad:')) {
        return {
            target: 'ad',
            id: value.split(':')[1] || '',
        }
    }

    if (lower.startsWith('menu:')) {
        return {
            target: 'menu',
            screen: value.split(':')[1] || 'NotificationScreen',
        }
    }

    if (lower === 'notifications' || lower === 'notification') {
        return {
            target: 'menu',
            screen: 'NotificationScreen',
        }
    }

    if (lower === 'ai') {
        return {
            target: 'menu',
            screen: 'AiScreen',
        }
    }

    if (lower === 'admin') {
        return {
            target: 'menu',
            screen: 'AdminScreen',
        }
    }

    if (lower === 'login') {
        return {
            target: 'menu',
            screen: 'LoginScreen',
        }
    }

    return {
        target: 'menu',
        screen: 'NotificationScreen',
        id: value,
    }
}

export default async function sendNotificationClient({
    title,
    description,
    screen,
    topic,
}: HandleSendProps): Promise<SendResponseClient> {
    try {
        const res = await fetch(`${window.location.origin}/api/notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                screen: normalizeScreenPayload(screen),
                topic,
            }),
        })
        const data = await res.json()
        if (data.success) {
            return {
                status: 200,
                message: 'Notification sent!',
            }
        } else {
            return {
                status: 500,
                message: `Error sending notification: ${JSON.stringify(data.error)}`,
            }
        }
    } catch (err) {
        return {
            status: 500,
            message: `Request failed: ${JSON.stringify(err)}`,
        }
    }
}
