import config from '@config'
import { cookies } from 'next/headers'

type GetWrapperProps = {
    path: string
    options?: object
    custom?: 'tekkom' | 'system' | 'beekeeper'
}

type PostWrapper = {
    path: string
    data?: object | FormData
    custom?: 'tekkom' | 'system'
    status?: boolean
}

type DeleteWrapperProps = {
    path: string
    options?: object
    custom?: 'tekkom' | 'system'
}

type PutWrapperProps = {
    path: string
    data?: object
    options?: object
    custom?: 'tekkom' | 'system'
}

const baseUrl = config.url.API_URL
const tekkomBotApiUrl = config.url.TEKKOM_BOT_API_URL
const systemUrl = config.url.system
const beekeeperUrl = config.beekeeper.serverAPI

export async function getWrapper({ path, options = {}, custom }: GetWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const url = custom === 'tekkom'
        ? tekkomBotApiUrl
        : custom === 'system'
            ? systemUrl
            : custom === 'beekeeper'
                ? beekeeperUrl
                : baseUrl

    const baseHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
    }

    const headers = custom === 'tekkom' ? {
        ...baseHeaders,
        btg: 'tekkom-bot'
    } : baseHeaders

    const defaultOptions = { method: 'GET', headers }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

export async function postWrapper({ path, data, custom, status }: PostWrapper) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const url = custom === 'tekkom'
        ? tekkomBotApiUrl
        : custom === 'system'
            ? systemUrl
            : custom === 'beekeeper'
                ? beekeeperUrl
                : baseUrl

    const isFormData = data instanceof FormData

    const defaultOptions = {
        method: 'POST',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${access_token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    }

    try {
        const response = await fetch(`${url}${path}`, defaultOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        if (status) {
            return { status: response.status, data }
        }

        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

export async function putWrapper({ path, data = {}, options = {}, custom }: PutWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const url = custom === 'tekkom'
        ? tekkomBotApiUrl
        : custom === 'system'
            ? systemUrl
            : custom === 'beekeeper'
                ? beekeeperUrl
                : baseUrl

    const defaultOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

export async function deleteWrapper({ path, options, custom }: DeleteWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const url = custom === 'tekkom'
        ? tekkomBotApiUrl
        : custom === 'system'
            ? systemUrl
            : custom === 'beekeeper'
                ? beekeeperUrl
                : baseUrl

    const defaultOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return data
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}
