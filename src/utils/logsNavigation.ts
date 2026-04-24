export type LogsHashTarget = {
    sourceId: string
    entryFingerprint: string | null
}

export function parseLogsHash(hash: string): LogsHashTarget | null {
    if (!hash.startsWith('#')) {
        return null
    }

    const [rawSourceId, rawQuery = ''] = hash.slice(1).split('?')
    const sourceId = decodeURIComponent(rawSourceId || '').trim()
    if (!sourceId) {
        return null
    }

    const params = new URLSearchParams(rawQuery)
    const entryFingerprint = params.get('entry') || params.get('id')

    return {
        sourceId,
        entryFingerprint: entryFingerprint ? decodeURIComponent(entryFingerprint) : null,
    }
}
