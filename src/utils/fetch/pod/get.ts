import config from '@config'
import debug from '@/utils/debug'

export default async function getPods(location: 'server' | 'client'): Promise<Pod[]> {
    const api = location === 'server' ? config.beekeeper.serverAPI : config.beekeeper.api
    const url = `${api}/pods`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }

        const services = await response.json()
        return services
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
