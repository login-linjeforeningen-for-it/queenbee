import { Agent, Dispatcher } from 'undici'

type FetchOptions = RequestInit & {
    dispatcher?: Dispatcher
}

export const config = {
    runtime: 'nodejs'
}

type FetchWrapperProps = {
    url: string
    options?: object
}

export default async function fetchWrapper({ url, options }: FetchWrapperProps) {
    const agent = new Agent({
        connect: {
            rejectUnauthorized: false
        }
    })

    const response = await fetch(url, {
        ...options,
        dispatcher: agent
    } as FetchOptions)

    return response
}
