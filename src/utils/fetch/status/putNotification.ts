import config from '@config'
import { getCookie } from '@utils/cookies'

type PutNotificationProps = {
    id: number
    name: string
    message: string
    webhook: string
}

export default async function putNotification({ id, name, message, webhook }: PutNotificationProps) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}${config.beekeeper.status.notifications.put}/${id}`, {
            method: 'PUT',
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
        return `Failed to put notification: ${error}`
    }
}
