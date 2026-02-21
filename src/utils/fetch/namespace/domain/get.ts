import config from '@config'
import debug from '@/utils/debug'

export default async function getDomains(location: 'server' | 'client', context: string, service: string): Promise<Domain[]> {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    const url =  `${api}/namespaces/domains/${context}/${service}`
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

        const domains = await response.json()
        return domains
    } catch (error) {
        debug({ detailed: `Error fetching url in getDomains: ${url}: ${error}`})
        return []
    }
}
