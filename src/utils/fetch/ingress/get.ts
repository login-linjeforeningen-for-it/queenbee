import config from '@config'
import { debug } from 'console'

export default async function getIngress(location: 'server' | 'client', context: string, namespace: string): Promise<Ingress[]> {
    const api = location === 'server' ? config.beekeeper.server : config.beekeeper.api
    const url = `${api}/namespaces/ingress/${context}/${namespace}`

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
