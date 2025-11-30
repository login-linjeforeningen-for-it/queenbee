import getContexts from '@utils/fetch/context/get'
import config from '@config'

const defaultCluster = config.beekeeper.defaultCluster

// eslint-disable-next-line @stylistic/semi
export default function getFormattedContexts(name: string): Promise<string>;
// eslint-disable-next-line @stylistic/semi
export default function getFormattedContexts(): Promise<string[]>;

export default async function getFormattedContexts(name?: string): Promise<string | string[]> {
    const contexts = await getContexts('server')
    const formattedContexts = contexts.map((service) => {
        const name = service.name.split('-')[1]
        const formattedName = `${name[0].toUpperCase()}${name.slice(1)}`
        return formattedName
    })

    const namedContext = formattedContexts.find((context) => context.includes(name || defaultCluster)) || defaultCluster

    return name ? namedContext : formattedContexts
}
