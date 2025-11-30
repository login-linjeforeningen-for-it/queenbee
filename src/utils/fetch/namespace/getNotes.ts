import config from '@config'
import debug from '@/utils/debug'

export default async function getNotes(location: 'server' | 'client', context: string, service: string): Promise<Domain[]> {
    const api = location === 'server' ? config.beekeeper.serverAPI : config.beekeeper.api
    const url = `${api}/namespaces/notes/${context}/${service}`

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

        const domains = await response.json()
        return domains
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
