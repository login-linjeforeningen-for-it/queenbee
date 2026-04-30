export type BucketSummary = {
    name: string
    createdAt: string | null
    objectCount: number
    sizeBytes: number
    sizeLabel: string
}

export type ObjectSummary = {
    key: string
    sizeBytes: number
    sizeLabel: string
    lastModified: string | null
    etag: string | null
    storageClass: string | null
}

export type FolderEntry = {
    type: 'folder'
    name: string
    key: string
    objectCount: number
    sizeBytes: number
}

export type FileEntry = {
    type: 'file'
    name: string
    object: ObjectSummary
}

export type BrowserEntry = FolderEntry | FileEntry
