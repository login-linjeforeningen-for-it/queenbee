import config from '@config'

export default function runCommand(location: 'server' | 'client', command: string) {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    try {
        const url = `${api}/commands/local`
        console.log(command)
        console.log(url)
    } catch (error) {
        console.log(error)
    }
}
