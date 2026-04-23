'use server'

import config from '@config'

export default async function resendNotification(id: string) {
    try {
        const response = await fetch(`${config.url.app}/notifications/${id}/resend`, {
            method: 'POST',
            headers: {
                ...(process.env.APP_API_ADMIN_TOKEN
                    ? { Authorization: `Bearer ${process.env.APP_API_ADMIN_TOKEN}` }
                    : {}),
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return await response.json() as AppNotificationHistoryEntry
    } catch (error) {
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
}
