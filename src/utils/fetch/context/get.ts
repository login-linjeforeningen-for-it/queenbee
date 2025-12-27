import config from '@config'
import debug from '@utils/debug'

export default async function getContexts(location: 'server' | 'client'): Promise<ServiceAsList[]> {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    const url = `${api}/contexts`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const services = await response.json()
        return services
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
