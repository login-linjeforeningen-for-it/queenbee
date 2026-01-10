import config from '@config'
import { cookies } from 'next/headers'

const baseUrl = config.url.api
const tekkomBotApiUrl = config.url.bot
const systemUrl = config.url.internal
const beekeeperUrl = config.url.beekeeper

type APIRequestProps = {
    service: 'bot' | 'internal' | 'beekeeper' | 'workerbee'
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
    path: string
    options?: RequestInit
    data?: object
}

type WrapperProps = Omit<APIRequestProps, 'method'>

async function apiRequest({ service, method, path, options, data }: APIRequestProps) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const url = service === 'bot'
        ? tekkomBotApiUrl
        : service === 'internal'
            ? systemUrl
            : service === 'beekeeper'
                ? beekeeperUrl
                : baseUrl

    const isFormData = data instanceof FormData

    const baseHeaders = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${token}`,
    }

    const headers = service === 'bot' ? {
        ...baseHeaders,
        btg: 'tekkom-bot'
    } : baseHeaders

    const finalOptions = {
        method,
        headers,
        ...options,
        body: data ? isFormData ? data : JSON.stringify(data) : undefined
    }

    try {
        const response = await fetch(`${url}/${path}`, finalOptions)
        if (!response.ok) {
            const text = await response.json()
            const message = text.message || text.error || text
            throw new Error(message)
        }

        const data = await response.json()
        return data

    } catch (error: unknown) {
        console.error('Fetch error', error)
        if (error instanceof Error) {
            return `Error: ${error.message}`
        } else {
            return 'Error: Unknown! Please contact TekKom'
        }
    }
}

export async function getWrapper({ service, path, options }: WrapperProps) {
    return await apiRequest({
        service, method: 'GET', path, options
    })
}

export async function postWrapper({ service, path, data }: WrapperProps) {
    return await apiRequest({
        method: 'POST', service, path, data
    })
}

export async function putWrapper({ service, path, options, data }: WrapperProps) {
    return await apiRequest({
        service, method: 'PUT', path, options, data
    })
}

export async function patchWrapper({ service, path, options, data }: WrapperProps) {
    return await apiRequest({
        service, method: 'PATCH', path, options, data
    })
}

export async function deleteWrapper({ service, path, options, data }: WrapperProps) {
    return await apiRequest({
        service, method: 'DELETE', path, options, data
    })
}