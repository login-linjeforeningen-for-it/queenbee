import config from '@config'
import { cookies } from 'next/headers'

export async function requireTekkomS3Access() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    if (!token) {
        return { ok: false as const, status: 401, message: 'Missing access token.' }
    }

    try {
        const response = await fetch(config.authentik.url.userinfo, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(3000),
            cache: 'no-store'
        })

        if (!response.ok) {
            return { ok: false as const, status: 401, message: 'Invalid access token.' }
        }

        const data = await response.json()
        const groups = Array.isArray(data.groups) ? data.groups.map((group: string) => group.toLowerCase()) : []
        if (!groups.includes('tekkom')) {
            return { ok: false as const, status: 403, message: 'TekKom access is required for S3 administration.' }
        }

        return { ok: true as const }
    } catch {
        return { ok: false as const, status: 503, message: 'Could not verify TekKom access.' }
    }
}
