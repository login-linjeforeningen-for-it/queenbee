'use server'

import config from '@config'

type PostScheduledNotificationProps = {
    title: string
    body: string
    topic: string
    data: Record<string, string>
    scheduledAt: string
}

export default async function postScheduledNotification(body: PostScheduledNotificationProps) {
    try {
        const response = await fetch(`${config.url.app}/notifications/scheduled`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(process.env.APP_API_ADMIN_TOKEN
                    ? { Authorization: `Bearer ${process.env.APP_API_ADMIN_TOKEN}` }
                    : {}),
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return await response.json() as ScheduledAppNotificationEntry
    } catch (error) {
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
}
