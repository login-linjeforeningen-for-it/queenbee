import debug from '@/utils/debug'
import config from '@config'

type GetIngressEventsProps = {
    location: 'server' | 'client'
    context: string
    namespace: string
    name: string
}

export default async function getIngressEvents({ location, context, namespace, name }: GetIngressEventsProps): Promise<string[]> {
    const api = location === 'server' ? config.beekeeper.serverAPI : config.beekeeper.api
    const url = `${api}/namespaces/ingress/events/${context}/${namespace}/${name}`

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
