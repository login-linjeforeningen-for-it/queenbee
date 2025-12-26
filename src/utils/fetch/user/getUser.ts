import config from '@config'
import debug from '@/utils/debug'

export default async function getAuthor(location: 'server' | 'client', email: string): Promise<User | null> {
    const api = location === 'server' ? config.beekeeper.server : config.beekeeper.api
    const url = `${api}/user/${email}`

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

        const user = await response.json()
        return user
    } catch (error) {
        debug({ basic: error as object })
        return null
    }
}
