import config from '@config'

type sendNotificationProps = {
    title: string
    description: string
    screen?: DetailedEvent | EventWithOnlyID | Record<string, string | number | boolean | null>
    topic?: string
}

function normalizeData(input?: Record<string, string | number | boolean | null>) {
    if (!input) {
        return {}
    }

    return Object.entries(input).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key] = String(value)
        }
        return acc
    }, {})
}

export default async function sendNotification({
    title,
    description,
    screen,
    topic,
}: sendNotificationProps): Promise<boolean> {
    try {
        const response = await fetch(`${config.url.app}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(process.env.APP_API_ADMIN_TOKEN
                    ? { Authorization: `Bearer ${process.env.APP_API_ADMIN_TOKEN}` }
                    : {}),
            },
            body: JSON.stringify({
                title,
                body: description,
                topic: topic || 'maintenance',
                data: normalizeData(screen as Record<string, string | number | boolean | null> | undefined),
            }),
        })

        return response.ok
    } catch {
        return false
    }
}
