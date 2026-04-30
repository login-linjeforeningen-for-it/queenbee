'use client'

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import {
    ArrowDownToLine,
    Boxes,
    Cloud,
    Copy,
    FolderPlus,
    HardDrive,
    LoaderCircle,
    MoveRight,
    RefreshCcw,
    Search,
    Trash2,
    Upload,
} from 'lucide-react'

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

const panelClass = 'rounded-3xl border border-white/5 bg-login-50/5 p-4'
const inputClass = 'rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none'
const secondaryButtonClass = 'rounded-lg border border-white/10 bg-login-50/5 px-3 py-2 text-sm hover:bg-login-50/10'
const primaryButtonClass = 'rounded-lg bg-orange-500/80 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500'
const dangerButtonClass = 'rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-100 hover:bg-red-500/15'

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
            setStatus(error instanceof Error ? error.message : 'Failed to load S3 buckets')
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
            setStatus(error instanceof Error ? error.message : 'Failed to load S3 objects')
        } finally {
            setLoading(false)
        }
    }

    async function createBucket() {
        if (!newBucket.trim()) return
        setLoading(true)
        try {
            await api('/api/internal/s3/buckets', {
                method: 'POST',
                body: JSON.stringify({ bucket: newBucket.trim() })
            })
            setNewBucket('')
            await loadBuckets()
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Failed to create bucket')
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
            await loadBuckets()
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Failed to delete bucket')
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
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Failed to upload object')
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
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Failed to move object')
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
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Failed to delete object')
        } finally {
            setLoading(false)
        }
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null
        setUploadFile(file)
        if (file && !uploadKey) {
            setUploadKey(file.name)
        }
    }

    const downloadHref = selectedBucket && selectedKey
        ? `/api/internal/s3/objects/download?${new URLSearchParams({ bucket: selectedBucket, key: selectedKey })}`
        : '#'

    return (
        <div className='h-full overflow-y-auto'>
            <div className='flex w-full flex-col gap-6 pb-4'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-xl font-semibold'>S3 Storage</h1>
                    <p className='text-sm text-muted-foreground'>Manage RustFS buckets behind s3.login.no and spaces.login.no.</p>
                </div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                    <Summary icon={<Cloud />} label='Buckets' value={String(buckets.length)} />
                    <Summary icon={<Boxes />} label='Objects' value={String(totalObjects)} />
                    <Summary icon={<HardDrive />} label='Total size' value={formatBytes(totalSize)} />
                    <Summary icon={<RefreshCcw />} label='Status' value={loading ? 'Working' : 'Ready'} />
                </div>

                <div className={panelClass}>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                        <div className='flex items-center gap-2 text-sm text-login-100'>
                            {loading && <LoaderCircle className='h-4 w-4 animate-spin text-orange-300' />}
                            <span>{status}</span>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <button className={secondaryButtonClass} onClick={() => void loadBuckets()}>
                                Refresh
                            </button>
                            <input
                                className={inputClass}
                                placeholder='new-bucket'
                                value={newBucket}
                                onChange={(event) => setNewBucket(event.target.value)}
                            />
                            <button className={primaryButtonClass} onClick={() => void createBucket()}>
                                <FolderPlus className='mr-1 inline h-4 w-4' />
                                Create
                            </button>
                            <button className={dangerButtonClass} onClick={() => void deleteSelectedBucket()}>
                                Delete bucket
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid min-h-[34rem] gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]'>
                    <aside className={panelClass}>
                        <div className='mb-3 flex items-center justify-between'>
                            <h2 className='font-semibold'>Buckets</h2>
                            <span className='text-xs text-muted-foreground'>{buckets.length}</span>
                        </div>
                        <div className='flex max-h-[32rem] flex-col gap-2 overflow-y-auto pr-1'>
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
                    </aside>

                    <main className='flex min-w-0 flex-col gap-4'>
                        <div className={panelClass}>
                            <div className='grid gap-3 lg:grid-cols-[1fr_1fr_auto]'>
                                <label className='flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm'>
                                    <Search className='h-4 w-4 text-muted-foreground' />
                                    <input
                                        className='w-full bg-transparent outline-none'
                                        placeholder='Search objects'
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                    />
                                </label>
                                <input
                                    className={inputClass}
                                    placeholder='Prefix filter'
                                    value={prefix}
                                    onChange={(event) => setPrefix(event.target.value)}
                                />
                                <button className={secondaryButtonClass} onClick={() => void loadObjects()}>
                                    List objects
                                </button>
                            </div>
                        </div>

                        <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]'>
                            <section className={panelClass}>
                                <div className='mb-3 flex items-center justify-between'>
                                    <h2 className='font-semibold'>{selectedBucket || 'Select a bucket'}</h2>
                                    <span className='text-xs text-muted-foreground'>{filteredObjects.length} objects</span>
                                </div>
                                <div className='max-h-[30rem] overflow-y-auto'>
                                    <table className='w-full text-left text-sm'>
                                        <thead className='sticky top-0 bg-login-950 text-xs text-muted-foreground'>
                                            <tr>
                                                <th className='py-2 pr-3'>Key</th>
                                                <th className='py-2 pr-3'>Size</th>
                                                <th className='py-2 pr-3'>Modified</th>
                                                <th className='py-2'>Class</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredObjects.map((object) => (
                                                <tr
                                                    key={object.key}
                                                    className={`cursor-pointer border-t border-white/5 ${
                                                        selectedKey === object.key ? 'bg-orange-500/10' : 'hover:bg-login-50/5'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedKey(object.key)
                                                        setTargetBucket(selectedBucket)
                                                        setTargetKey(object.key)
                                                    }}
                                                >
                                                    <td className='max-w-[28rem] truncate py-2 pr-3 font-mono text-xs text-white'>
                                                        {object.key}
                                                    </td>
                                                    <td className='py-2 pr-3 text-muted-foreground'>{object.sizeLabel}</td>
                                                    <td className='py-2 pr-3 text-muted-foreground'>
                                                        {formatDateTime(object.lastModified)}
                                                    </td>
                                                    <td className='py-2 text-muted-foreground'>{object.storageClass || 'standard'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <aside className='flex flex-col gap-4'>
                                <Panel title='Upload'>
                                    <input
                                        className={`${inputClass} w-full`}
                                        type='file'
                                        onChange={onFileChange}
                                    />
                                    <input
                                        className={`${inputClass} w-full`}
                                        placeholder='Object key'
                                        value={uploadKey}
                                        onChange={(event) => setUploadKey(event.target.value)}
                                    />
                                    <button className={`${primaryButtonClass} w-full`} onClick={() => void uploadSelectedFile()}>
                                        <Upload className='mr-1 inline h-4 w-4' />
                                        Upload
                                    </button>
                                </Panel>

                                <Panel title='Selected object'>
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
                                            <a className={`${secondaryButtonClass} text-center`} href={downloadHref}>
                                                <ArrowDownToLine className='mr-1 inline h-4 w-4' />
                                                Download
                                            </a>
                                            <button className={dangerButtonClass} onClick={() => void deleteSelectedObject()}>
                                                <Trash2 className='mr-1 inline h-4 w-4' />
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <p className='text-sm text-muted-foreground'>
                                            Select an object to inspect, download, move, copy, or delete it.
                                        </p>
                                    )}
                                </Panel>

                                <Panel title={copyMode ? 'Copy object' : 'Move object'}>
                                    <select
                                        className={`${inputClass} w-full`}
                                        value={targetBucket}
                                        onChange={(event) => setTargetBucket(event.target.value)}
                                    >
                                        <option value=''>Target bucket</option>
                                        {buckets.map(bucket => (
                                            <option key={bucket.name} value={bucket.name}>{bucket.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        className={`${inputClass} w-full`}
                                        placeholder='Target key'
                                        value={targetKey}
                                        onChange={(event) => setTargetKey(event.target.value)}
                                    />
                                    <label className='flex items-center gap-2 text-sm text-muted-foreground'>
                                        <input
                                            type='checkbox'
                                            checked={copyMode}
                                            onChange={(event) => setCopyMode(event.target.checked)}
                                        />
                                        Copy instead of move
                                    </label>
                                    <button className={`${primaryButtonClass} w-full`} onClick={() => void moveSelectedObject()}>
                                        {copyMode
                                            ? <Copy className='mr-1 inline h-4 w-4' />
                                            : <MoveRight className='mr-1 inline h-4 w-4' />}
                                        {copyMode ? 'Copy' : 'Move'}
                                    </button>
                                </Panel>
                            </aside>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

function Summary({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
    return (
        <div className='rounded-3xl border border-white/5 bg-login-50/5 p-4'>
            <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300'>
                {icon}
            </div>
            <div className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>{label}</div>
            <div className='mt-1 text-xl font-semibold text-white'>{value}</div>
        </div>
    )
}

function Panel({ title, children }: { title: string, children: ReactNode }) {
    return (
        <div className='flex flex-col gap-3 rounded-3xl border border-white/5 bg-login-50/5 p-4'>
            <h2 className='font-semibold text-white'>{title}</h2>
            {children}
        </div>
    )
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
