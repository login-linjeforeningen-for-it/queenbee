import config from '@config'
import { getCookie } from '@utils/cookies'

export default async function deleteNotification(id: number) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}${config.beekeeper.status.notifications.delete}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        return `Failed to delete notification: ${error}`
    }
}
