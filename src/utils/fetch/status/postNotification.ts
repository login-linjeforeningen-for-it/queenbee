import config from '@config'
import { getCookie } from '@utils/cookies'

type PostNotificationProps = {
    name: string
    message: string
    webhook: string
}

export default async function postNotification({ name, message, webhook }: PostNotificationProps) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}/${config.beekeeper.status.notifications.post}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, message, webhook })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        return `Failed to post notification: ${error}`
    }
}
