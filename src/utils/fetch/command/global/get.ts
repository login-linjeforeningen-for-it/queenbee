import debug from '@/utils/debug'
import config from '@config'

export default async function getGlobalCommands(location: 'server' | 'client'): Promise<GlobalCommand[]> {
    const api = location === 'server' ? config.beekeeper.server : config.beekeeper.api
    const url = `${api}/commands/global`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }

        const commands = await response.json()
        return commands
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
