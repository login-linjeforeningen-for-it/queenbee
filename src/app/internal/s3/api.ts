export default async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
    const headers = init?.body instanceof FormData ? init.headers : {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
    }
    const response = await fetch(url, { ...init, headers, cache: 'no-store' })

    if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Request failed with ${response.status}`)
    }

    return await response.json()
}
