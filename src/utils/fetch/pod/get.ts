import config from '@config'
import debug from '@/utils/debug'

export default async function getPods(location: 'server' | 'client'): Promise<Pod[]> {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    const url = `${api}/pods`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(3000),
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
