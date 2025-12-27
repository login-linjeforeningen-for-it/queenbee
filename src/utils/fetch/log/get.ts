import config from '@config'
import debug from '@utils/debug'

type LogParams = {
    location: 'server' | 'client'
    path: 'global' | 'local'
    page: number
    resultsPerPage?: number
    namespace?: string
    context?: string
    search?: string
}

type Log = {
    page: number
    resultsPerPage: number
    pages: number
    results: (LocalLog | GlobalLog)[]
    error?: string
}

export default async function getLogs({
    location,
    path,
    page,
    namespace,
    context,
    search,
    resultsPerPage
}: LogParams): Promise<Log> {
    const api = location === 'server' ? config.url.beekeeper : config.beekeeper.api
    const baseUrl = `${api}/log/${path}`
    const params = new URLSearchParams({ page: String(page) })
    const isGlobal = namespace === 'global'

    if (resultsPerPage) {
        params.set('resultsPerPage', String(resultsPerPage))
    }

    if (!isGlobal && namespace) {
        params.set('namespace', namespace)
    }

    if (context) {
        params.set('context', context)
    }

    if (search) {
        params.set('search', search)
    }

    const url = `${baseUrl}?${params.toString()}`
    debug({
        basic: `Fetching logs from ${url}`,
        detailed: `Fetching logs (${location}) from ${url}`,
    })

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
            debug({ detailed: { message: `Fetching logs (${location}) from ${url} failed`, data } })
            throw Error(data.error)
        }

        const services = await response.json()
        debug({ full: { message: `Fetching logs (${location}) with url ${url} completed successfully`, data: services } })
        return services
    } catch (error) {
        debug({ production: { message: `Fetching logs (${location}) from ${url} failed`, error: error as object } })
        return {
            page: 1,
            pages: 1,
            resultsPerPage: 0,
            error: `Fetching logs (${location}) from ${url} failed`,
            results: []
        }
    }
}
