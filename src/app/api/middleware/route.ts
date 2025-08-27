import config from '@config'
import { Agent, Dispatcher } from 'undici'

type FetchOptions = RequestInit & {
    dispatcher?: Dispatcher
}

export async function tokenIsValidNode(token: string) {
    try {
        const agent = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        })

        const response = await fetch(`${config.url.API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` },
            agent
        } as FetchOptions)

        if (!response.ok) {
            const errorDescription = `Failed connection to: ${config.url.API_URL}/events: ${await response.text()}`
            console.error(errorDescription)
            return false
        }

        return true
    } catch (error) {
        console.error(`API Error: ${JSON.stringify(error)}`)
        return false
    }
}
