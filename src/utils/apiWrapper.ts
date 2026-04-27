import config from '@config'
import { cookies } from 'next/headers'

const baseUrl = config.url.api
const tekkomBotApiUrl = config.url.bot
const beekeeperUrl = config.url.beekeeper

type APIRequestProps = {
    service: 'bot' | 'beekeeper' | 'workerbee'
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

    const timeoutMs = service === 'beekeeper'
        ? path.startsWith('docker/logs')
            ? 30000
            : (path.startsWith('backup') || path.startsWith('docker/') || path === 'docker' || path === 'db')
                ? 15000
                : 3000
        : 3000

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const finalOptions = {
        method,
        headers,
        ...options,
        signal: controller.signal,
        body: data ? isFormData ? data : JSON.stringify(data) : undefined
    }

    try {
        const response = await fetch(`${url}/${path}`, finalOptions)
        clearTimeout(timeoutId)

        if (!response.ok) {
            const text = await response.json()
            const message = text.message || text.error || text
            throw new Error(message)
        }

        const data = await response.json()
        return data

    } catch (error: unknown) {
        clearTimeout(timeoutId)

        if (error instanceof Error) {
            console.error(`Fetch error: ${error.name} - ${error.message} (${url}/${path})`)
            if (error.name === 'AbortError') {
                return `Error: Request timed out after ${timeoutMs / 1000} seconds`
            }
            return `Error: ${error.message}`
        } else {
            console.error('Fetch error: ', error)
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
