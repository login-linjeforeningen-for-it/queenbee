import config from '@config'
import { getCookie } from 'utilbee/utils'

export default async function deleteService(id: number) {
    try {
        const token = getCookie('access_token')
        const response = await fetch(`${config.beekeeper.api}/${config.beekeeper.status.services.delete}/${id}`, {
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
        return `Failed to delete service: ${error}`
    }
}
