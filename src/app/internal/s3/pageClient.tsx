'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Boxes, Cloud, HardDrive, RefreshCcw } from 'lucide-react'
import { StatCard, toast } from 'uibee/components'
import { BucketList, ObjectBrowser } from '@components/s3/components'
import { buildBrowserEntries, formatBytes, isValidBucketName } from '@components/s3/helpers'
import type { BucketSummary, ObjectSummary } from '@components/s3/types'

async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
    const headers = init?.body instanceof FormData ? init.headers : {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
    }
    const response = await fetch(url, { ...init, headers, cache: 'no-store' })
    if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Request failed with ${response.status}`)
    }
    return response.json()
}

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
    const [uploadOpen, setUploadOpen] = useState(false)
    const [moveOpen, setMoveOpen] = useState(false)

    useEffect(() => {
        void loadBuckets()
    }, [])

    useEffect(() => {
        if (selectedBucket) void loadObjects(selectedBucket, prefix)
    }, [selectedBucket, prefix])

    const selectedObject = objects.find(o => o.key === selectedKey)
    const totalObjects = buckets.reduce((sum, b) => sum + b.objectCount, 0)
    const totalSize = buckets.reduce((sum, b) => sum + b.sizeBytes, 0)
    const filteredObjects = useMemo(() => filterObjects(objects, search), [objects, search])
    const browserEntries = useMemo(
        () => buildBrowserEntries(filteredObjects, prefix, Boolean(search.trim())),
        [filteredObjects, prefix, search],
    )
    const bucketOptions = buckets.map(b => ({ label: b.name, value: b.name }))

    async function loadBuckets() {
        await withLoading(async () => {
            const data = await api<{ buckets: BucketSummary[] }>('/api/internal/s3/buckets')
            const nextBucket = selectedBucket || data.buckets[0]?.name || ''
            setBuckets(data.buckets)
            setSelectedBucket(nextBucket)
            if (nextBucket) await loadObjects(nextBucket, prefix)
        }, 'Failed to load S3 buckets')
    }

    async function loadObjects(bucket = selectedBucket, nextPrefix = prefix) {
        if (!bucket) return
        await withLoading(async () => {
            const params = new URLSearchParams({ bucket })
            if (nextPrefix) params.set('prefix', nextPrefix)
            const data = await api<{ objects: ObjectSummary[] }>(`/api/internal/s3/objects?${params}`)
            setObjects(data.objects)
            setSelectedKey(current =>
                current && data.objects.some(o => o.key === current) ? current : '',
            )
        }, 'Failed to load S3 objects', () => setObjects([]))
    }

    async function createBucket() {
        const bucket = newBucket.trim()
        if (!isValidBucketName(bucket)) {
            toast.error('Bucket names must be 3-63 lowercase characters, numbers, dots, or hyphens.')
            return
        }
        await withLoading(async () => {
            await api('/api/internal/s3/buckets', { method: 'POST', body: JSON.stringify({ bucket }) })
            setNewBucket('')
            setSelectedBucket(bucket)
            setTargetBucket(bucket)
            await loadBuckets()
            toast.success(`Created ${bucket}`)
        }, 'Failed to create bucket')
    }

    async function deleteSelectedBucket() {
        if (!selectedBucket || !confirm(`Delete bucket ${selectedBucket}? It must be empty.`)) return
        await withLoading(async () => {
            await api(`/api/internal/s3/buckets/${encodeURIComponent(selectedBucket)}`, { method: 'DELETE' })
            setSelectedBucket('')
            setPrefix('')
            setSearch('')
            await loadBuckets()
            toast.success(`Deleted ${selectedBucket}`)
        }, 'Failed to delete bucket')
    }

    async function uploadSelectedFile() {
        if (!selectedBucket || !uploadFile) return
        const key = uploadKey.trim() || uploadFile.name
        const form = new FormData()
        form.set('bucket', selectedBucket)
        form.set('key', key)
        form.set('file', uploadFile)
        await withLoading(async () => {
            await api('/api/internal/s3/objects', { method: 'POST', body: form })
            setUploadFile(null)
            setUploadKey('')
            setUploadOpen(false)
            await Promise.all([loadObjects(), loadBuckets()])
            toast.success(`Uploaded ${key}`)
        }, 'Failed to upload object')
    }

    async function moveSelectedObject() {
        if (!selectedBucket || !selectedKey || !targetBucket || !targetKey.trim()) return
        await withLoading(async () => {
            await api('/api/internal/s3/objects', {
                method: 'PATCH',
                body: JSON.stringify({
                    sourceBucket: selectedBucket,
                    sourceKey: selectedKey,
                    targetBucket,
                    targetKey: targetKey.trim(),
                    mode: copyMode ? 'copy' : 'move',
                }),
            })
            await Promise.all([loadObjects(), loadBuckets()])
            setMoveOpen(false)
            toast.success(`${copyMode ? 'Copied' : 'Moved'} ${selectedKey}`)
        }, 'Failed to move object')
    }

    async function deleteSelectedObject() {
        if (!selectedBucket || !selectedKey || !confirm(`Delete ${selectedKey}?`)) return
        await withLoading(async () => {
            const params = new URLSearchParams({ bucket: selectedBucket, key: selectedKey })
            await api(`/api/internal/s3/objects?${params}`, { method: 'DELETE' })
            await Promise.all([loadObjects(), loadBuckets()])
            toast.success(`Deleted ${selectedKey}`)
        }, 'Failed to delete object')
    }

    async function withLoading(action: () => Promise<void>, fallback: string, onError?: () => void) {
        setLoading(true)
        try {
            await action()
        } catch (error) {
            onError?.()
            const message = error instanceof Error ? error.message : fallback
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null
        setUploadFile(file)
        if (file && !uploadKey) setUploadKey(`${prefix}${file.name}`)
    }

    function selectObject(object: ObjectSummary) {
        setSelectedKey(object.key)
        setTargetBucket(selectedBucket)
        setTargetKey(object.key)
    }

    return (
        <div className='flex h-full min-h-0 w-full flex-col gap-3 overflow-hidden'>
            <h1 className='shrink-0 text-lg font-semibold text-login-50'>S3 Storage</h1>
            <div className='grid shrink-0 grid-cols-4 gap-3'>
                <StatCard icon={Cloud} label='Buckets' tone='amber' value={String(buckets.length)} />
                <StatCard icon={Boxes} label='Objects' tone='emerald' value={String(totalObjects)} />
                <StatCard icon={HardDrive} label='Total size' tone='violet' value={formatBytes(totalSize)} />
                <StatCard
                    icon={RefreshCcw}
                    label='Status'
                    tone='blue'
                    value={loading ? 'Working…' : 'Ready'}
                />
            </div>

            <div className='grid min-h-0 flex-1 gap-3 overflow-hidden xl:grid-cols-[20rem_minmax(0,1fr)]'>
                <BucketList
                    buckets={buckets}
                    loading={loading}
                    newBucket={newBucket}
                    selectedBucket={selectedBucket}
                    onCreateBucket={createBucket}
                    onDeleteBucket={deleteSelectedBucket}
                    onNewBucketChange={setNewBucket}
                    onSelect={(bucket) => {
                        setSelectedBucket(bucket.name)
                        setTargetBucket(bucket.name)
                        setPrefix('')
                        setSearch('')
                    }}
                />
                <ObjectBrowser
                    bucketOptions={bucketOptions}
                    entries={browserEntries}
                    filteredCount={filteredObjects.length}
                    loading={loading}
                    prefix={prefix}
                    search={search}
                    selectedBucket={selectedBucket}
                    selectedKey={selectedKey}
                    selectedObject={selectedObject}
                    onDeleteObject={deleteSelectedObject}
                    onOpenFolder={setPrefix}
                    onRefresh={loadObjects}
                    onSearchChange={setSearch}
                    onSelectObject={selectObject}
                    upload={{
                        uploadOpen,
                        uploadFile,
                        uploadKey,
                        onFileChange,
                        onUpload: uploadSelectedFile,
                        onUploadKeyChange: setUploadKey,
                        onUploadOpenChange: setUploadOpen,
                    }}
                    move={{
                        moveOpen,
                        targetBucket,
                        targetKey,
                        copyMode,
                        onMoveObject: moveSelectedObject,
                        onMoveOpenChange: setMoveOpen,
                        onCopyModeChange: setCopyMode,
                        onTargetBucketChange: setTargetBucket,
                        onTargetKeyChange: setTargetKey,
                    }}
                />
            </div>
        </div>
    )
}

function filterObjects(objects: ObjectSummary[], search: string) {
    const q = search.trim().toLowerCase()
    if (!q) return objects
    return objects.filter(
        o =>
            o.key.toLowerCase().includes(q) ||
            o.storageClass?.toLowerCase().includes(q) ||
            o.etag?.toLowerCase().includes(q),
    )
}
