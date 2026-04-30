'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { toast } from 'uibee/components'
import api from './api'
import { BucketList, ObjectActions, ObjectFilters, ObjectTable, PageHeader, TopBar } from './components'
import {
    buildBrowserEntries,
    isValidBucketName,
} from './helpers'
import type { BucketSummary, ObjectSummary } from './types'

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
        if (selectedBucket) void loadObjects(selectedBucket, prefix)
    }, [selectedBucket, prefix])

    const selectedObject = objects.find(object => object.key === selectedKey)
    const totalObjects = buckets.reduce((sum, bucket) => sum + bucket.objectCount, 0)
    const totalSize = buckets.reduce((sum, bucket) => sum + bucket.sizeBytes, 0)
    const filteredObjects = useMemo(() => filterObjects(objects, search), [objects, search])
    const browserEntries = useMemo(
        () => buildBrowserEntries(filteredObjects, prefix, Boolean(search.trim())),
        [filteredObjects, prefix, search]
    )
    const selectedBucketOptions = buckets.map(bucket => ({ label: bucket.name, value: bucket.name }))

    async function loadBuckets() {
        await withLoading(async () => {
            const data = await api<{ buckets: BucketSummary[] }>('/api/internal/s3/buckets')
            const nextBucket = selectedBucket || data.buckets[0]?.name || ''
            setBuckets(data.buckets)
            setSelectedBucket(nextBucket)
            if (nextBucket) await loadObjects(nextBucket, prefix)
            setStatus(data.buckets.length ? `Loaded ${data.buckets.length} buckets` : 'No buckets found')
        }, 'Failed to load S3 buckets')
    }

    async function loadObjects(bucket = selectedBucket, nextPrefix = prefix) {
        if (!bucket) return
        await withLoading(async () => {
            const params = new URLSearchParams({ bucket })
            if (nextPrefix) params.set('prefix', nextPrefix)
            const data = await api<{ objects: ObjectSummary[] }>(`/api/internal/s3/objects?${params}`)
            setObjects(data.objects)
            setSelectedKey(current => data.objects.some(object => object.key === current) ? current : data.objects[0]?.key || '')
            setStatus(`Loaded ${data.objects.length} objects from ${bucket}`)
        }, 'Failed to load S3 objects', () => setObjects([]))
    }

    async function createBucket() {
        const bucket = newBucket.trim()
        if (!isValidBucketName(bucket)) {
            setStatus('Bucket names must be 3-63 lowercase characters, numbers, dots, or hyphens.')
            return
        }

        await withLoading(async () => {
            await api('/api/internal/s3/buckets', { method: 'POST', body: JSON.stringify({ bucket }) })
            setNewBucket('')
            setSelectedBucket(bucket)
            setTargetBucket(bucket)
            await loadBuckets()
            notice(`Created ${bucket}`)
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
            notice(`Deleted ${selectedBucket}`)
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
            await Promise.all([loadObjects(), loadBuckets()])
            notice(`Uploaded ${key}`)
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
                    mode: copyMode ? 'copy' : 'move'
                })
            })
            await Promise.all([loadObjects(), loadBuckets()])
            notice(`${copyMode ? 'Copied' : 'Moved'} ${selectedKey}`)
        }, 'Failed to move object')
    }

    async function deleteSelectedObject() {
        if (!selectedBucket || !selectedKey || !confirm(`Delete ${selectedKey}?`)) return
        await withLoading(async () => {
            const params = new URLSearchParams({ bucket: selectedBucket, key: selectedKey })
            await api(`/api/internal/s3/objects?${params}`, { method: 'DELETE' })
            await Promise.all([loadObjects(), loadBuckets()])
            notice(`Deleted ${selectedKey}`)
        }, 'Failed to delete object')
    }

    async function withLoading(action: () => Promise<void>, fallback: string, onError?: () => void) {
        setLoading(true)
        try {
            await action()
        } catch (error) {
            onError?.()
            const message = error instanceof Error ? error.message : fallback
            setStatus(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    function notice(message: string) {
        setStatus(message)
        toast.success(message)
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
        <div className='flex h-[calc(100vh-2rem)] min-h-0 w-full flex-col gap-4 overflow-hidden pb-2'>
            <PageHeader />
            <TopBar
                buckets={buckets}
                loading={loading}
                newBucket={newBucket}
                status={status}
                totalObjects={totalObjects}
                totalSize={totalSize}
                onCreateBucket={createBucket}
                onDeleteBucket={deleteSelectedBucket}
                onRefresh={loadBuckets}
                onNewBucketChange={setNewBucket}
            />

            <div className='grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[20rem_minmax(0,1fr)]'>
                <BucketList
                    buckets={buckets}
                    selectedBucket={selectedBucket}
                    onSelect={(bucket) => {
                        setSelectedBucket(bucket.name)
                        setTargetBucket(bucket.name)
                        setPrefix('')
                        setSearch('')
                    }}
                />
                <main className='grid min-h-0 min-w-0 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1fr)_21rem]'>
                    <div className='flex min-h-0 min-w-0 flex-col gap-4 overflow-hidden'>
                        <ObjectFilters
                            prefix={prefix}
                            search={search}
                            onPrefixChange={setPrefix}
                            onSearchChange={setSearch}
                            onRefresh={loadObjects}
                        />
                        <ObjectTable
                            entries={browserEntries}
                            filteredCount={filteredObjects.length}
                            prefix={prefix}
                            search={search}
                            selectedBucket={selectedBucket}
                            selectedKey={selectedKey}
                            onOpenFolder={setPrefix}
                            onSelectObject={selectObject}
                        />
                    </div>
                    <ObjectActions
                        buckets={selectedBucketOptions}
                        copyMode={copyMode}
                        loading={loading}
                        selectedBucket={selectedBucket}
                        selectedKey={selectedKey}
                        selectedObject={selectedObject}
                        targetBucket={targetBucket}
                        targetKey={targetKey}
                        uploadKey={uploadKey}
                        uploadFile={uploadFile}
                        onCopyModeChange={setCopyMode}
                        onDeleteObject={deleteSelectedObject}
                        onFileChange={onFileChange}
                        onMoveObject={moveSelectedObject}
                        onTargetBucketChange={setTargetBucket}
                        onTargetKeyChange={setTargetKey}
                        onUpload={uploadSelectedFile}
                        onUploadKeyChange={setUploadKey}
                    />
                </main>
            </div>
        </div>
    )
}

function filterObjects(objects: ObjectSummary[], search: string) {
    const q = search.trim().toLowerCase()
    if (!q) return objects
    return objects.filter(object =>
        object.key.toLowerCase().includes(q)
        || object.storageClass?.toLowerCase().includes(q)
        || object.etag?.toLowerCase().includes(q)
    )
}
