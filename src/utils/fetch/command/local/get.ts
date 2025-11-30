import config from '@config'
import debug from '@/utils/debug'

export default async function getLocalCommands(location: 'server' | 'client', service: string): Promise<LocalCommand[]> {
    const api = location === 'server' ? config.beekeeper.serverAPI : config.beekeeper.api
    const url = `${api}/commands/local`

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
        return commands.filter((command: LocalCommand) => command.namespace.toLowerCase() === service)
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
