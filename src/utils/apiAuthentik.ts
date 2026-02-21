'use server'

import config from '@config'

type AuthentikApiWrapperProps = {
    path: string
    token: string
    body?: object
}

export async function authentikApiWrapper({ path, token }: AuthentikApiWrapperProps) {
    const url = `${config.url.authentik}/api/v3${path}`

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    const options: RequestInit = {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(3000),
    }

    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Authentik API error: ${response.status} ${errorText}`)
        }

        const text = await response.text()
        return text ? JSON.parse(text) : null
    } catch (error) {
        console.error('Authentik API call failed:', error)
        throw error
    }
}
