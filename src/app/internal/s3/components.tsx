import type { ChangeEvent } from 'react'
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
import { Button, Input, Select, Switch } from 'uibee/components'
import { GlassCard, MonoBlock, StatCard } from '@/uibee'
import BrowserRow from './browserRow'
import { cleanPrefix, formatBytes, formatDate, isValidBucketName, normalizeBucketName, parentPrefix, prefixSegments } from './helpers'
import type { BrowserEntry, BucketSummary, ObjectSummary } from './types'

type ObjectActionProps = {
    buckets: { label: string, value: string }[]
    copyMode: boolean
    loading: boolean
    selectedBucket: string
    selectedKey: string
    selectedObject?: ObjectSummary
    targetBucket: string
    targetKey: string
    uploadFile: File | null
    uploadKey: string
    onCopyModeChange: (value: boolean) => void
    onDeleteObject: () => Promise<void>
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onMoveObject: () => Promise<void>
    onTargetBucketChange: (value: string) => void
    onTargetKeyChange: (value: string) => void
    onUpload: () => Promise<void>
    onUploadKeyChange: (value: string) => void
}

export function PageHeader() {
    return (
        <div className='shrink-0'>
            <h1 className='text-xl font-semibold'>S3 Storage</h1>
            <p className='mt-1 text-sm text-muted-foreground'>Browse buckets, upload files, and manage objects.</p>
        </div>
    )
}

export function TopBar({
    buckets,
    loading,
    newBucket,
    status,
    totalObjects,
    totalSize,
    onCreateBucket,
    onDeleteBucket,
    onRefresh,
    onNewBucketChange,
}: {
    buckets: BucketSummary[]
    loading: boolean
    newBucket: string
    status: string
    totalObjects: number
    totalSize: number
    onCreateBucket: () => Promise<void>
    onDeleteBucket: () => Promise<void>
    onRefresh: () => Promise<void>
    onNewBucketChange: (value: string) => void
}) {
    return (
        <div className='grid shrink-0 gap-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_23rem]'>
            <StatCard icon={Cloud} label='Buckets' tone='amber' value={String(buckets.length)} />
            <StatCard icon={Boxes} label='Objects' tone='emerald' value={String(totalObjects)} />
            <StatCard icon={HardDrive} label='Total size' tone='violet' value={formatBytes(totalSize)} />
            <StatCard icon={RefreshCcw} label='Status' tone='blue' value={loading ? 'Working' : 'Ready'} />
            <GlassCard className='p-4'>
                <div className='mb-3 flex min-w-0 items-center gap-2 text-xs text-muted-foreground'>
                    {loading ? <LoaderCircle className='h-4 w-4 shrink-0 animate-spin text-orange-300' /> : null}
                    <span className='truncate'>{status}</span>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <Button
                        text='Refresh'
                        icon={<RefreshCcw className='h-3.5 w-3.5' />}
                        variant='secondary'
                        className='h-10.5! min-h-10.5! w-full!'
                        onClick={() => void onRefresh()}
                    />
                    <Input
                        name='newBucket'
                        placeholder='new-bucket'
                        value={newBucket}
                        onChange={(event) => onNewBucketChange(normalizeBucketName(event.target.value))}
                    />
                    <Button
                        text='Create'
                        icon={<FolderPlus className='h-3.5 w-3.5' />}
                        disabled={loading || !isValidBucketName(newBucket)}
                        className='h-10.5! min-h-10.5! w-full!'
                        onClick={() => void onCreateBucket()}
                    />
                    <Button
                        text='Delete'
                        icon={<Trash2 className='h-3.5 w-3.5' />}
                        variant='danger'
                        className='h-10.5! min-h-10.5! w-full!'
                        onClick={() => void onDeleteBucket()}
                    />
                </div>
            </GlassCard>
        </div>
    )
}

export function BucketList({
    buckets,
    selectedBucket,
    onSelect,
}: {
    buckets: BucketSummary[]
    selectedBucket: string
    onSelect: (bucket: BucketSummary) => void
}) {
    return (
        <GlassCard className='flex min-h-0 flex-col overflow-hidden p-4'>
            <div className='mb-3 flex items-center justify-between'>
                <h2 className='font-semibold'>Buckets</h2>
                <span className='text-xs text-muted-foreground'>{buckets.length}</span>
            </div>
            <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'>
                {buckets.map((bucket) => (
                    <button
                        key={bucket.name}
                        className={`rounded-xl border p-3 text-left transition ${
                            selectedBucket === bucket.name
                                ? 'border-orange-400/35 bg-orange-500/10'
                                : 'border-white/5 bg-login-950/25 hover:bg-login-50/8'
                        }`}
                        onClick={() => onSelect(bucket)}
                    >
                        <div className='font-semibold text-white'>{bucket.name}</div>
                        <div className='mt-1 flex justify-between text-xs text-muted-foreground'>
                            <span>{bucket.objectCount} objects</span>
                            <span>{bucket.sizeLabel}</span>
                        </div>
                    </button>
                ))}
            </div>
        </GlassCard>
    )
}

export function ObjectFilters({
    prefix,
    search,
    onPrefixChange,
    onSearchChange,
    onRefresh,
}: {
    prefix: string
    search: string
    onPrefixChange: (value: string) => void
    onSearchChange: (value: string) => void
    onRefresh: () => Promise<void>
}) {
    return (
        <GlassCard className='shrink-0 p-4'>
            <div className='grid gap-3 lg:grid-cols-[1fr_1fr_auto]'>
                <Input
                    name='objectSearch'
                    icon={<Search className='h-4 w-4' />}
                    placeholder='Search objects'
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
                <Input
                    name='prefix'
                    placeholder='Prefix filter'
                    value={prefix}
                    onChange={(event) => onPrefixChange(cleanPrefix(event.target.value))}
                />
                <Button
                    text='List objects'
                    icon={<RefreshCcw className='h-4 w-4' />}
                    variant='secondary'
                    className='h-10.5! min-h-10.5!'
                    onClick={() => void onRefresh()}
                />
            </div>
        </GlassCard>
    )
}

export function ObjectTable({
    entries,
    filteredCount,
    prefix,
    search,
    selectedBucket,
    selectedKey,
    onOpenFolder,
    onSelectObject,
}: {
    entries: BrowserEntry[]
    filteredCount: number
    prefix: string
    search: string
    selectedBucket: string
    selectedKey: string
    onOpenFolder: (prefix: string) => void
    onSelectObject: (object: ObjectSummary) => void
}) {
    return (
        <GlassCard className='flex min-h-0 flex-col overflow-hidden p-4'>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
                <div className='min-w-0'>
                    <h2 className='font-semibold'>{selectedBucket || 'Select a bucket'}</h2>
                    <Breadcrumb prefix={prefix} onOpenFolder={onOpenFolder} />
                </div>
                <span className='text-xs text-muted-foreground'>{entries.length} visible · {filteredCount} objects</span>
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
                        {prefix && !search ? (
                            <BrowserRow
                                entry={{ type: 'folder', name: '..', key: parentPrefix(prefix), objectCount: 0, sizeBytes: 0 }}
                                selectedKey={selectedKey}
                                onOpenFolder={onOpenFolder}
                                onSelectObject={onSelectObject}
                            />
                        ) : null}
                        {entries.map((entry) => (
                            <BrowserRow
                                key={entry.type === 'folder' ? entry.key : entry.object.key}
                                entry={entry}
                                selectedKey={selectedKey}
                                onOpenFolder={onOpenFolder}
                                onSelectObject={onSelectObject}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    )
}

export function ObjectActions(props: ObjectActionProps) {
    return (
        <aside className='flex min-h-0 flex-col gap-4 overflow-y-auto pr-1'>
            <UploadCard {...props} />
            <SelectedObjectCard {...props} />
            <MoveObjectCard {...props} />
        </aside>
    )
}

function Breadcrumb({ prefix, onOpenFolder }: { prefix: string, onOpenFolder: (prefix: string) => void }) {
    return (
        <div className='mt-1 flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground'>
            <button className='rounded-md border border-white/10 px-2 py-1 hover:bg-login-50/5' onClick={() => onOpenFolder('')}>
                root
            </button>
            {prefixSegments(prefix).map((segment) => (
                <button
                    key={segment.path}
                    className='rounded-md border border-white/10 px-2 py-1 hover:bg-login-50/5'
                    onClick={() => onOpenFolder(segment.path)}
                >
                    {segment.name}
                </button>
            ))}
        </div>
    )
}

function UploadCard({
    loading,
    selectedBucket,
    uploadFile,
    uploadKey,
    onFileChange,
    onUpload,
    onUploadKeyChange,
}: ObjectActionProps) {
    return (
        <GlassCard className='flex flex-col gap-3 p-4'>
            <h2 className='font-semibold text-white'>Upload</h2>
            <Input name='objectFile' type='file' onChange={onFileChange} />
            <Input
                name='uploadKey'
                placeholder='Object key'
                value={uploadKey}
                onChange={(event) => onUploadKeyChange(event.target.value)}
            />
            <Button
                text='Upload'
                icon={<Upload className='h-4 w-4' />}
                className='w-full!'
                disabled={loading || !selectedBucket || !uploadFile}
                onClick={() => void onUpload()}
            />
        </GlassCard>
    )
}

function SelectedObjectCard({ selectedBucket, selectedKey, selectedObject, onDeleteObject }: ObjectActionProps) {
    const downloadHref = selectedBucket && selectedKey
        ? `/api/internal/s3/objects/download?${new URLSearchParams({ bucket: selectedBucket, key: selectedKey })}`
        : '#'

    return (
        <GlassCard className='flex flex-col gap-3 p-4'>
            <h2 className='font-semibold text-white'>Selected object</h2>
            {selectedObject ? (
                <>
                    <MonoBlock>{selectedObject.key}</MonoBlock>
                    <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                        <span>Size</span><span className='text-right text-white'>{selectedObject.sizeLabel}</span>
                        <span>Modified</span><span className='text-right text-white'>{formatDate(selectedObject.lastModified)}</span>
                    </div>
                    <a
                        className='flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md
                            bg-login-500/70 px-4 outline outline-login-500 select-none hover:bg-login-500/90'
                        href={downloadHref}
                    >
                        <ArrowDownToLine className='h-4 w-4' />
                        Download
                    </a>
                    <Button
                        text='Delete'
                        icon={<Trash2 className='h-4 w-4' />}
                        variant='danger'
                        className='w-full!'
                        onClick={() => void onDeleteObject()}
                    />
                </>
            ) : (
                <p className='text-sm text-muted-foreground'>Select an object to inspect, download, move, copy, or delete it.</p>
            )}
        </GlassCard>
    )
}

function MoveObjectCard({
    buckets,
    copyMode,
    loading,
    selectedBucket,
    selectedKey,
    targetBucket,
    targetKey,
    onCopyModeChange,
    onMoveObject,
    onTargetBucketChange,
    onTargetKeyChange,
}: ObjectActionProps) {
    return (
        <GlassCard className='flex flex-col gap-3 p-4'>
            <h2 className='font-semibold text-white'>{copyMode ? 'Copy object' : 'Move object'}</h2>
            <Select
                name='targetBucket'
                value={targetBucket}
                placeholder='Target bucket'
                options={buckets}
                onChange={(value) => onTargetBucketChange(String(value || ''))}
            />
            <Input
                name='targetKey'
                placeholder='Target key'
                value={targetKey}
                onChange={(event) => onTargetKeyChange(event.target.value)}
            />
            <Switch
                name='copyMode'
                label='Copy instead of move'
                checked={copyMode}
                onChange={(event) => onCopyModeChange(event.target.checked)}
            />
            <Button
                text={copyMode ? 'Copy' : 'Move'}
                icon={copyMode ? <Copy className='h-4 w-4' /> : <MoveRight className='h-4 w-4' />}
                className='w-full!'
                disabled={loading || !selectedBucket || !selectedKey || !targetBucket || !targetKey.trim()}
                onClick={() => void onMoveObject()}
            />
        </GlassCard>
    )
}
