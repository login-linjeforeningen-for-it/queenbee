import config from '@config'
import { getCookie } from '@utils/cookies'

export default async function putService(id: number, form: NewService) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}${config.beekeeper.status.services.put}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        return `Failed to put service: ${error}`
    }
}
