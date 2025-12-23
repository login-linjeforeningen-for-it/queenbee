import config from '@config'
import { getCookie } from '@utils/cookies'

export default async function postTag(name: string, color: string) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}${config.beekeeper.status.tags.post}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, color })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        return `Failed to post tag: ${error}`
    }
}
