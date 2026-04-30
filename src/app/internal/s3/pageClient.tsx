'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import {
    ArrowDownToLine,
    ArrowUp,
    Boxes,
    Cloud,
    Copy,
    File as FileIcon,
    Folder,
    FolderPlus,
    HardDrive,
    LoaderCircle,
    MoveRight,
    RefreshCcw,
    Search,
    Trash2,
    Upload,
} from 'lucide-react'
import { Button, Highlight, Input, Select, Switch, toast } from 'uibee/components'

type BucketSummary = {
    name: string
    createdAt: string | null
    objectCount: number
    sizeBytes: number
    sizeLabel: string
}

type ObjectSummary = {
    key: string
    sizeBytes: number
    sizeLabel: string
    lastModified: string | null
    etag: string | null
    storageClass: string | null
}

type FolderEntry = {
    type: 'folder'
    name: string
    key: string
    objectCount: number
    sizeBytes: number
}

type FileEntry = {
    type: 'file'
    name: string
    object: ObjectSummary
}

type BrowserEntry = FolderEntry | FileEntry

export default function S3PageClient() {
    const [buckets, setBuckets] = useState<BucketSummary[]>([])
    const [objects, setObjects] = useState<ObjectSummary[]>([])
    const [selectedBucket, setSelectedBucket] = useState('')
    const [selectedKey, setSelectedKey] = useState('')
    const [prefix, setPrefix] = useState('')
    const [search, setSearch] = useState('')
    const [newBucket, setNewBucket] = useState('')
    const [uploadKey, setUploadKey] = useState('')
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [targetBucket, setTargetBucket] = useState('')
    const [targetKey, setTargetKey] = useState('')
    const [copyMode, setCopyMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('Loading S3 buckets')

    useEffect(() => {
        void loadBuckets()
    }, [])

    useEffect(() => {
        if (selectedBucket) {
            void loadObjects(selectedBucket, prefix)
        }
    }, [selectedBucket, prefix])

    const selectedObject = objects.find(object => object.key === selectedKey)
    const totalSize = buckets.reduce((sum, bucket) => sum + bucket.sizeBytes, 0)
    const totalObjects = buckets.reduce((sum, bucket) => sum + bucket.objectCount, 0)

    const filteredObjects = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return objects
        return objects.filter(object =>
            object.key.toLowerCase().includes(q)
            || object.storageClass?.toLowerCase().includes(q)
            || object.etag?.toLowerCase().includes(q)
        )
    }, [objects, search])
    const browserEntries = useMemo(
        () => buildBrowserEntries(filteredObjects, prefix, Boolean(search.trim())),
        [filteredObjects, prefix, search]
    )
    const canCreateBucket = isValidBucketName(newBucket)

    async function loadBuckets() {
        setLoading(true)
        try {
            const data = await api<{ buckets: BucketSummary[] }>('/api/internal/s3/buckets')
            setBuckets(data.buckets)
            const nextBucket = selectedBucket || data.buckets[0]?.name || ''
            setSelectedBucket(nextBucket)
            if (nextBucket) {
                await loadObjects(nextBucket, prefix)
            }
            setStatus(data.buckets.length ? `Loaded ${data.buckets.length} buckets` : 'No buckets found')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load S3 buckets'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function loadObjects(bucket = selectedBucket, nextPrefix = prefix) {
        if (!bucket) return
        setLoading(true)
        try {
            const params = new URLSearchParams({ bucket })
            if (nextPrefix) params.set('prefix', nextPrefix)
            const data = await api<{ objects: ObjectSummary[] }>(`/api/internal/s3/objects?${params}`)
            setObjects(data.objects)
            setSelectedKey(current => data.objects.some(object => object.key === current) ? current : data.objects[0]?.key || '')
            setStatus(`Loaded ${data.objects.length} objects from ${bucket}`)
        } catch (error) {
            setObjects([])
            const message = error instanceof Error ? error.message : 'Failed to load S3 objects'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function createBucket() {
        const bucket = newBucket.trim()
        if (!isValidBucketName(bucket)) {
            setStatus('Bucket names must be 3-63 lowercase characters, numbers, dots, or hyphens.')
            return
        }

        setLoading(true)
        try {
            await api('/api/internal/s3/buckets', {
                method: 'POST',
                body: JSON.stringify({ bucket })
            })
            setNewBucket('')
            await loadBuckets()
            setSelectedBucket(bucket)
            setTargetBucket(bucket)
            setStatus(`Created ${bucket}`)
            toast.success(`Created ${bucket}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create bucket'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function deleteSelectedBucket() {
        if (!selectedBucket || !confirm(`Delete bucket ${selectedBucket}? It must be empty.`)) return
        setLoading(true)
        try {
            await api(`/api/internal/s3/buckets/${encodeURIComponent(selectedBucket)}`, { method: 'DELETE' })
            setSelectedBucket('')
            setPrefix('')
            setSearch('')
            await loadBuckets()
            toast.success(`Deleted ${selectedBucket}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete bucket'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function uploadSelectedFile() {
        if (!selectedBucket || !uploadFile) return
        const key = uploadKey.trim() || uploadFile.name
        const form = new FormData()
        form.set('bucket', selectedBucket)
        form.set('key', key)
        form.set('file', uploadFile)
        setLoading(true)
        try {
            await api('/api/internal/s3/objects', { method: 'POST', body: form })
            setUploadFile(null)
            setUploadKey('')
            await loadObjects()
            await loadBuckets()
            setStatus(`Uploaded ${key}`)
            toast.success(`Uploaded ${key}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload object'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function moveSelectedObject() {
        if (!selectedBucket || !selectedKey || !targetBucket || !targetKey.trim()) return
        setLoading(true)
        try {
            await api('/api/internal/s3/objects', {
                method: 'PATCH',
                body: JSON.stringify({
                    sourceBucket: selectedBucket,
                    sourceKey: selectedKey,
                    targetBucket,
                    targetKey: targetKey.trim(),
                    mode: copyMode ? 'copy' : 'move'
                })
            })
            await loadObjects()
            await loadBuckets()
            setStatus(`${copyMode ? 'Copied' : 'Moved'} ${selectedKey}`)
            toast.success(`${copyMode ? 'Copied' : 'Moved'} ${selectedKey}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to move object'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    async function deleteSelectedObject() {
        if (!selectedBucket || !selectedKey || !confirm(`Delete ${selectedKey}?`)) return
        setLoading(true)
        try {
            const params = new URLSearchParams({ bucket: selectedBucket, key: selectedKey })
            await api(`/api/internal/s3/objects?${params}`, { method: 'DELETE' })
            await loadObjects()
            await loadBuckets()
            setStatus(`Deleted ${selectedKey}`)
            toast.success(`Deleted ${selectedKey}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete object'
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null
        setUploadFile(file)
        if (file && !uploadKey) {
            setUploadKey(`${prefix}${file.name}`)
        }
    }

    const downloadHref = selectedBucket && selectedKey
        ? `/api/internal/s3/objects/download?${new URLSearchParams({ bucket: selectedBucket, key: selectedKey })}`
        : '#'

    return (
        <div className='flex h-[calc(100vh-2rem)] min-h-0 w-full flex-col gap-4 overflow-hidden pb-2'>
            <div className='shrink-0'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-xl font-semibold'>S3 Storage</h1>
                    <p className='text-sm text-muted-foreground'>
                        Login S3.
                    </p>
                </div>
            </div>

            <div className='grid shrink-0 gap-3 md:grid-cols-2 xl:grid-cols-5'>
                {[
                    { icon: <Cloud />, label: 'Buckets', value: String(buckets.length) },
                    { icon: <Boxes />, label: 'Objects', value: String(totalObjects) },
                    { icon: <HardDrive />, label: 'Total size', value: formatBytes(totalSize) },
                    { icon: <RefreshCcw />, label: 'Status', value: loading ? 'Working' : 'Ready' },
                ].map((item) => (
                    <Highlight key={item.label} className='p-4'>
                        <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-login/10 text-login'>
                            {item.icon}
                        </div>
                        <div className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>{item.label}</div>
                        <div className='mt-1 text-xl font-semibold text-white'>{item.value}</div>
                    </Highlight>
                ))}
                <Highlight className='p-3'>
                    <div className='mb-2 flex min-w-0 items-center gap-2 text-xs text-login-100'>
                        {loading && <LoaderCircle className='h-4 w-4 shrink-0 animate-spin text-orange-300' />}
                        <span className='truncate'>{status}</span>
                    </div>
                    <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-2'>
                        <Button
                            text='Refresh'
                            icon={<RefreshCcw className='h-3.5 w-3.5' />}
                            variant='secondary'
                            className='h-10.5! min-h-10.5!'
                            onClick={() => void loadBuckets()}
                        />
                        <Input
                            name='newBucket'
                            placeholder='new-bucket'
                            value={newBucket}
                            onChange={(event) => setNewBucket(normalizeBucketName(event.target.value))}
                        />
                        <Button
                            text='Create'
                            icon={<FolderPlus className='h-3.5 w-3.5' />}
                            disabled={loading || !canCreateBucket}
                            className='h-10.5! min-h-10.5!'
                            onClick={() => void createBucket()}
                        />
                        <Button
                            text='Delete'
                            icon={<Trash2 className='h-3.5 w-3.5' />}
                            variant='danger'
                            className='h-10.5! min-h-10.5!'
                            onClick={() => void deleteSelectedBucket()}
                        />
                    </div>
                </Highlight>
            </div>

            <div className='grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[22rem_minmax(0,1fr)]'>
                <Highlight className='flex min-h-0 flex-col overflow-hidden p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                        <h2 className='font-semibold'>Buckets</h2>
                        <span className='text-xs text-muted-foreground'>{buckets.length}</span>
                    </div>
                    <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'>
                        {buckets.map((bucket) => (
                            <button
                                key={bucket.name}
                                className={`rounded-2xl border p-3 text-left transition ${
                                    selectedBucket === bucket.name
                                        ? 'border-orange-400/40 bg-orange-500/10'
                                        : 'border-white/5 bg-black/10 hover:bg-login-50/5'
                                }`}
                                onClick={() => {
                                    setSelectedBucket(bucket.name)
                                    setTargetBucket(bucket.name)
                                    setPrefix('')
                                    setSearch('')
                                }}
                            >
                                <div className='font-semibold text-white'>{bucket.name}</div>
                                <div className='mt-1 flex justify-between text-xs text-muted-foreground'>
                                    <span>{bucket.objectCount} objects</span>
                                    <span>{bucket.sizeLabel}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </Highlight>

                <main className='flex min-h-0 min-w-0 flex-col gap-4 overflow-hidden'>
                    <Highlight className='shrink-0 p-4'>
                        <div className='grid gap-3 lg:grid-cols-[1fr_1fr_auto]'>
                            <Input
                                name='objectSearch'
                                icon={<Search className='h-4 w-4' />}
                                placeholder='Search objects'
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <Input
                                name='prefix'
                                placeholder='Prefix filter'
                                value={prefix}
                                onChange={(event) => setPrefix(cleanPrefix(event.target.value))}
                            />
                            <Button
                                text='List objects'
                                icon={<RefreshCcw className='h-4 w-4' />}
                                variant='secondary'
                                className='h-10.5! min-h-10.5!'
                                onClick={() => void loadObjects()}
                            />
                        </div>
                    </Highlight>

                    <div className='grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1fr)_22rem]'>
                        <Highlight className='flex min-h-0 flex-col overflow-hidden p-4'>
                            <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
                                <div className='min-w-0'>
                                    <h2 className='font-semibold'>{selectedBucket || 'Select a bucket'}</h2>
                                    <div className='mt-1 flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                                        <button
                                            className='rounded-md border border-white/10 px-2 py-1 hover:bg-login-50/5'
                                            onClick={() => setPrefix('')}
                                        >
                                            root
                                        </button>
                                        {prefixSegments(prefix).map((segment) => (
                                            <button
                                                key={segment.path}
                                                className='rounded-md border border-white/10 px-2 py-1 hover:bg-login-50/5'
                                                onClick={() => setPrefix(segment.path)}
                                            >
                                                {segment.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                    {browserEntries.length} visible · {filteredObjects.length} objects
                                </span>
                            </div>
                            <div className='min-h-0 flex-1 overflow-auto'>
                                <table className='w-full min-w-184 text-left text-sm'>
                                    <thead className='sticky top-0 z-10 bg-login-950 text-xs text-muted-foreground'>
                                        <tr>
                                            <th className='py-2 pr-3'>Name</th>
                                            <th className='py-2 pr-3'>Size</th>
                                            <th className='py-2 pr-3'>Modified</th>
                                            <th className='py-2'>Class</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prefix && !search && (
                                            <BrowserRow
                                                entry={{
                                                    type: 'folder',
                                                    name: '..',
                                                    key: parentPrefix(prefix),
                                                    objectCount: 0,
                                                    sizeBytes: 0
                                                }}
                                                selectedKey={selectedKey}
                                                onOpenFolder={setPrefix}
                                                onSelectObject={selectObject}
                                            />
                                        )}
                                        {browserEntries.map((entry) => (
                                            <BrowserRow
                                                key={entry.type === 'folder' ? entry.key : entry.object.key}
                                                entry={entry}
                                                selectedKey={selectedKey}
                                                onOpenFolder={setPrefix}
                                                onSelectObject={selectObject}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Highlight>

                        <aside className='flex min-h-0 flex-col gap-4 overflow-y-auto pr-1'>
                            <Highlight className='flex flex-col gap-3 p-4'>
                                <h2 className='font-semibold text-white'>Upload</h2>
                                <Input
                                    name='objectFile'
                                    type='file'
                                    onChange={onFileChange}
                                />
                                <Input
                                    name='uploadKey'
                                    placeholder='Object key'
                                    value={uploadKey}
                                    onChange={(event) => setUploadKey(event.target.value)}
                                />
                                <Button
                                    text='Upload'
                                    icon={<Upload className='h-4 w-4' />}
                                    className='w-full!'
                                    disabled={loading || !selectedBucket || !uploadFile}
                                    onClick={() => void uploadSelectedFile()}
                                />
                            </Highlight>

                            <Highlight className='flex flex-col gap-3 p-4'>
                                <h2 className='font-semibold text-white'>Selected object</h2>
                                {selectedObject ? (
                                    <>
                                        <div className='break-all rounded-lg bg-black/20 p-3 font-mono text-xs text-white'>
                                            {selectedObject.key}
                                        </div>
                                        <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                                            <span>Size</span><span className='text-right text-white'>{selectedObject.sizeLabel}</span>
                                            <span>Modified</span>
                                            <span className='text-right text-white'>
                                                {formatDate(selectedObject.lastModified)}
                                            </span>
                                        </div>
                                        <a
                                            className='flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md
                                                bg-login-500/70 px-4 outline outline-login-500 select-none hover:bg-login-500/90'
                                            href={downloadHref}
                                        >
                                            <ArrowDownToLine className='mr-1 inline h-4 w-4' />
                                            Download
                                        </a>
                                        <Button
                                            text='Delete'
                                            icon={<Trash2 className='h-4 w-4' />}
                                            variant='danger'
                                            className='w-full!'
                                            onClick={() => void deleteSelectedObject()}
                                        />
                                    </>
                                ) : (
                                    <p className='text-sm text-muted-foreground'>
                                        Select an object to inspect, download, move, copy, or delete it.
                                    </p>
                                )}
                            </Highlight>

                            <Highlight className='flex flex-col gap-3 p-4'>
                                <h2 className='font-semibold text-white'>{copyMode ? 'Copy object' : 'Move object'}</h2>
                                <Select
                                    name='targetBucket'
                                    value={targetBucket}
                                    placeholder='Target bucket'
                                    options={buckets.map(bucket => ({ label: bucket.name, value: bucket.name }))}
                                    onChange={(value) => setTargetBucket(String(value || ''))}
                                />
                                <Input
                                    name='targetKey'
                                    placeholder='Target key'
                                    value={targetKey}
                                    onChange={(event) => setTargetKey(event.target.value)}
                                />
                                <Switch
                                    name='copyMode'
                                    label='Copy instead of move'
                                    checked={copyMode}
                                    onChange={(event) => setCopyMode(event.target.checked)}
                                />
                                <Button
                                    text={copyMode ? 'Copy' : 'Move'}
                                    icon={copyMode ? <Copy className='h-4 w-4' /> : <MoveRight className='h-4 w-4' />}
                                    className='w-full!'
                                    disabled={loading || !selectedBucket || !selectedKey || !targetBucket || !targetKey.trim()}
                                    onClick={() => void moveSelectedObject()}
                                />
                            </Highlight>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    )

    function selectObject(object: ObjectSummary) {
        setSelectedKey(object.key)
        setTargetBucket(selectedBucket)
        setTargetKey(object.key)
    }
}

function BrowserRow({
    entry,
    selectedKey,
    onOpenFolder,
    onSelectObject
}: {
    entry: BrowserEntry
    selectedKey: string
    onOpenFolder: (prefix: string) => void
    onSelectObject: (object: ObjectSummary) => void
}) {
    if (entry.type === 'folder') {
        const isParent = entry.name === '..'

        return (
            <tr
                className='cursor-pointer border-t border-white/5 hover:bg-login-50/5'
                onClick={() => onOpenFolder(entry.key)}
            >
                <td className='py-2 pr-3'>
                    <div className='flex min-w-0 items-center gap-2 text-white'>
                        {isParent
                            ? <ArrowUp className='h-4 w-4 text-orange-300' />
                            : <Folder className='h-4 w-4 text-orange-300' />}
                        <span className='truncate font-mono text-xs'>{entry.name}</span>
                    </div>
                </td>
                <td className='py-2 pr-3 text-muted-foreground'>
                    {isParent ? '' : formatBytes(entry.sizeBytes)}
                </td>
                <td className='py-2 pr-3 text-muted-foreground'>
                    {isParent ? '' : `${entry.objectCount} objects`}
                </td>
                <td className='py-2 text-muted-foreground'>folder</td>
            </tr>
        )
    }

    const object = entry.object

    return (
        <tr
            className={`cursor-pointer border-t border-white/5 ${
                selectedKey === object.key ? 'bg-orange-500/10' : 'hover:bg-login-50/5'
            }`}
            onClick={() => onSelectObject(object)}
        >
            <td className='py-2 pr-3'>
                <div className='flex min-w-0 items-center gap-2 text-white'>
                    <FileIcon className='h-4 w-4 shrink-0 text-login-100' />
                    <span className='truncate font-mono text-xs'>{entry.name}</span>
                </div>
            </td>
            <td className='py-2 pr-3 text-muted-foreground'>{object.sizeLabel}</td>
            <td className='py-2 pr-3 text-muted-foreground'>{formatDateTime(object.lastModified)}</td>
            <td className='py-2 text-muted-foreground'>{object.storageClass || 'standard'}</td>
        </tr>
    )
}

function buildBrowserEntries(objects: ObjectSummary[], prefix: string, flatten: boolean): BrowserEntry[] {
    if (flatten) {
        return objects.map((object) => ({
            type: 'file',
            name: object.key,
            object
        }))
    }

    const folders = new Map<string, FolderEntry>()
    const files: FileEntry[] = []

    objects.forEach((object) => {
        const relativeKey = object.key.slice(prefix.length)
        if (!relativeKey) {
            return
        }

        const [firstSegment, ...rest] = relativeKey.split('/')
        if (rest.length) {
            const folderKey = `${prefix}${firstSegment}/`
            const existing = folders.get(folderKey)
            folders.set(folderKey, {
                type: 'folder',
                name: firstSegment,
                key: folderKey,
                objectCount: (existing?.objectCount || 0) + 1,
                sizeBytes: (existing?.sizeBytes || 0) + object.sizeBytes
            })
            return
        }

        files.push({
            type: 'file',
            name: firstSegment,
            object
        })
    })

    return [
        ...Array.from(folders.values()).sort((a, b) => a.name.localeCompare(b.name)),
        ...files.sort((a, b) => a.name.localeCompare(b.name))
    ]
}

function prefixSegments(prefix: string) {
    const names = prefix.split('/').filter(Boolean)
    return names.map((name, index) => ({
        name,
        path: `${names.slice(0, index + 1).join('/')}/`
    }))
}

function parentPrefix(prefix: string) {
    const names = prefix.split('/').filter(Boolean)
    return names.length > 1 ? `${names.slice(0, -1).join('/')}/` : ''
}

function cleanPrefix(value: string) {
    const cleaned = value.replace(/^\/+/, '')
    return cleaned && !cleaned.endsWith('/') ? `${cleaned}/` : cleaned
}

function normalizeBucketName(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9.-]/g, '')
}

function isValidBucketName(value: string) {
    return /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(value)
}

async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
    const headers = init?.body instanceof FormData ? init.headers : {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
    }
    const response = await fetch(url, {
        ...init,
        headers,
        cache: 'no-store'
    })
    if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Request failed with ${response.status}`)
    }
    return await response.json()
}

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0 B'
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function formatDateTime(value: string | null) {
    return value ? new Date(value).toLocaleString('nb-NO') : 'N/A'
}

function formatDate(value: string | null) {
    return value ? new Date(value).toLocaleDateString('nb-NO') : 'N/A'
}
