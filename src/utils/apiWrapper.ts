import config from '@config'
import { cookies } from 'next/headers'

type GetWrapperProps = {
    path: string
    options?: object
    custom?: 'tekkom'
}

type PostWrapper = {
    path: string
    data?: object
    custom?: string
}

type DeleteWrapperProps = {
    path: string
    options?: object
    custom?: string
}

type PutWrapperProps = {
    path: string
    data?: object
    options?: object
    custom?: string
}

const baseUrl = config.url.API_URL
const tekkomBotApiUrl = config.url.TEKKOM_BOT_API_URL

export async function getWrapper({ path, options = {}, custom }: GetWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const baseHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

        const text = await response.text()
        return JSON.parse(text)
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}

export async function postWrapper({ path, data, custom }: PostWrapper) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }

    try {
        const response = await fetch(`${url}${path}`, defaultOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const text = await response.text()
        return JSON.parse(text)
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
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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

export async function putWrapper({ path, data = {}, options = {}, custom }: PutWrapperProps) {
    const Cookies = await cookies()
    const access_token = Cookies.get('access_token')?.value || ''
    const bot_access_token = Cookies.get('bot_access_token')?.value || ''
    const token = custom === 'tekkom' ? bot_access_token : access_token
    const url = custom === 'tekkom' ? tekkomBotApiUrl : baseUrl

    const defaultOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${url}${path}`, finalOptions)
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const text = await response.text()
        return JSON.parse(text)
        // eslint-disable-next-line
    } catch (error: any) {
        return (
            JSON.stringify(error.error) ||
            JSON.stringify(error.message) ||
            'Unknown error! Please contact TekKom'
        )
    }
}