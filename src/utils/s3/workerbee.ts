import config from '@config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type ProxyOptions = {
    method?: string
    path: string
    body?: BodyInit | null
    headers?: HeadersInit
}

export async function workerbeeS3Proxy(options: ProxyOptions) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value || ''
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${token}`)

    const response = await fetch(`${config.url.api}/s3/${options.path}`, {
        method: options.method || 'GET',
        headers,
        body: options.body,
        cache: 'no-store',
        signal: AbortSignal.timeout(30000),
    })

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
        const payload = await response.json()
        return NextResponse.json(payload, { status: response.status })
    }

    const nextHeaders = new Headers()
    ;['content-type', 'content-disposition', 'content-length'].forEach((name) => {
        const value = response.headers.get(name)
        if (value) {
            nextHeaders.set(name, value)
        }
    })

    return new NextResponse(response.body, {
        status: response.status,
        headers: nextHeaders,
    })
}

export function appendSearch(path: string, search: URLSearchParams) {
    const query = search.toString()
    return query ? `${path}?${query}` : path
}
