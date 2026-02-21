import config from '@config'
import debug from '@/utils/debug'

export default async function getLocalCommands(location: 'server' | 'client', service: string): Promise<LocalCommand[]> {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    const url = `${api}/commands/local`

    try {
        const response = await fetch(url, {
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

        const commands = await response.json()
        return commands.filter((command: LocalCommand) => command.namespace.toLowerCase() === service)
    } catch (error) {
        debug({ basic: error as object })
        return []
    }
}
