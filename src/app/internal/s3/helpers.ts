import type { BrowserEntry, FolderEntry, ObjectSummary } from './types'

export function buildBrowserEntries(objects: ObjectSummary[], prefix: string, flatten: boolean): BrowserEntry[] {
    if (flatten) return objects.map((object) => ({ type: 'file', name: object.key, object }))

    const folders = new Map<string, FolderEntry>()
    const files: BrowserEntry[] = []

    objects.forEach((object) => {
        const relativeKey = object.key.slice(prefix.length)
        if (!relativeKey) return

        const [firstSegment, ...rest] = relativeKey.split('/')
        if (!rest.length) {
            files.push({ type: 'file', name: firstSegment, object })
            return
        }

        const folderKey = `${prefix}${firstSegment}/`
        const existing = folders.get(folderKey)
        folders.set(folderKey, {
            type: 'folder',
            name: firstSegment,
            key: folderKey,
            objectCount: (existing?.objectCount || 0) + 1,
            sizeBytes: (existing?.sizeBytes || 0) + object.sizeBytes
        })
    })

    return [...folders.values(), ...files].sort((a, b) => a.name.localeCompare(b.name))
}

export function cleanPrefix(value: string) {
    const cleaned = value.replace(/^\/+/, '')
    return cleaned && !cleaned.endsWith('/') ? `${cleaned}/` : cleaned
}

export function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export function formatDate(value: string | null) {
    return value ? new Date(value).toLocaleDateString('nb-NO') : 'N/A'
}

export function formatDateTime(value: string | null) {
    return value ? new Date(value).toLocaleString('nb-NO') : 'N/A'
}

export function isValidBucketName(value: string) {
    return /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(value)
}

export function normalizeBucketName(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9.-]/g, '')
}

export function parentPrefix(prefix: string) {
    const names = prefix.split('/').filter(Boolean)
    return names.length > 1 ? `${names.slice(0, -1).join('/')}/` : ''
}

export function prefixSegments(prefix: string) {
    const names = prefix.split('/').filter(Boolean)
    return names.map((name, index) => ({ name, path: `${names.slice(0, index + 1).join('/')}/` }))
}
