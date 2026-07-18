import type { ChangeEvent } from 'react'
import {
    Archive,
    ArrowDownToLine,
    Boxes,
    Copy,
    FileText,
    FolderPlus,
    MoveRight,
    RefreshCcw,
    Search,
    Trash2,
    Upload,
    X,
    ArrowUp,
    File as FileIcon,
    Folder,
} from 'lucide-react'
import { Button, Card, Input, Select, Toggle } from 'uibee/components'

import {
    formatBytes,
    formatDate,
    formatDateTime,
    isValidBucketName,
    normalizeBucketName,
    parentPrefix,
    prefixSegments,
} from './helpers'
import type { BrowserEntry, BucketSummary, ObjectSummary } from './types'


export function BucketList({
    buckets,
    loading,
    newBucket,
    selectedBucket,
    onCreateBucket,
    onDeleteBucket,
    onNewBucketChange,
    onSelect,
}: {
    buckets: BucketSummary[]
    loading: boolean
    newBucket: string
    selectedBucket: string
    onCreateBucket: () => Promise<void>
    onDeleteBucket: () => Promise<void>
    onNewBucketChange: (value: string) => void
    onSelect: (bucket: BucketSummary) => void
}) {
    return (
        <Card className='flex min-h-0 flex-col overflow-hidden p-4'>
            <div className='mb-3 flex items-center gap-2'>
                <Archive className='h-4 w-4 shrink-0 text-login' />
                <h2 className='text-sm font-semibold text-login-50'>Buckets</h2>
                <span className='ml-auto text-xs text-login-300'>{buckets.length}</span>
            </div>

            <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1'>
                {buckets.length === 0 && (
                    <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                        No buckets found.
                    </div>
                )}
                {buckets.map((bucket) => (
                    <div
                        key={bucket.name}
                        role='button'
                        tabIndex={0}
                        className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                            selectedBucket === bucket.name
                                ? 'border-login-400/35 bg-login/10'
                                : 'border-white/5 bg-login-50/5 hover:bg-login-50/8'
                        }`}
                        onClick={() => onSelect(bucket)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(bucket) }}
                    >
                        <div className='flex items-center gap-2'>
                            <Archive
                                className={`h-3.5 w-3.5 shrink-0 ${selectedBucket === bucket.name ? 'text-login' : 'text-login-300'}`}
                            />
                            <span className='text-sm font-semibold text-login-50'>{bucket.name}</span>
                        </div>
                        <div className='mt-1.5 flex justify-between text-xs text-login-300'>
                            <span>{bucket.objectCount} objects</span>
                            <span>{bucket.sizeLabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-3 shrink-0 border-t border-white/5 pt-3 flex flex-col gap-2'>
                <div className='-mb-5'>
                    <Input
                        name='newBucket'
                        placeholder='new-bucket-name'
                        value={newBucket}
                        onChange={(e) => onNewBucketChange(normalizeBucketName(e.target.value))}
                    />
                </div>
                <div className='flex gap-2'>
                    <Button
                        text='Create'
                        icon={<FolderPlus className='h-3.5 w-3.5' />}
                        disabled={loading || !isValidBucketName(newBucket)}
                        className='flex-1!'
                        onClick={() => void onCreateBucket()}
                    />
                    <Button
                        text='Delete'
                        icon={<Trash2 className='h-3.5 w-3.5' />}
                        variant='danger'
                        disabled={!selectedBucket}
                        onClick={() => void onDeleteBucket()}
                    />
                </div>
            </div>
        </Card>
    )
}


type UploadProps = {
    uploadFile: File | null
    uploadKey: string
    uploadOpen: boolean
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    onUpload: () => Promise<void>
    onUploadKeyChange: (value: string) => void
    onUploadOpenChange: (open: boolean) => void
}

type MoveProps = {
    moveOpen: boolean
    targetBucket: string
    targetKey: string
    copyMode: boolean
    onMoveObject: () => Promise<void>
    onMoveOpenChange: (open: boolean) => void
    onCopyModeChange: (value: boolean) => void
    onTargetBucketChange: (value: string) => void
    onTargetKeyChange: (value: string) => void
}

type ObjectBrowserProps = {
    bucketOptions: { label: string; value: string }[]
    entries: BrowserEntry[]
    filteredCount: number
    loading: boolean
    prefix: string
    search: string
    selectedBucket: string
    selectedKey: string
    selectedObject?: ObjectSummary
    upload: UploadProps
    move: MoveProps
    onDeleteObject: () => Promise<void>
    onOpenFolder: (prefix: string) => void
    onRefresh: () => Promise<void>
    onSearchChange: (value: string) => void
    onSelectObject: (object: ObjectSummary) => void
}

export function ObjectBrowser({
    bucketOptions,
    entries,
    filteredCount,
    loading,
    prefix,
    search,
    selectedBucket,
    selectedKey,
    selectedObject,
    upload: { uploadFile, uploadKey, uploadOpen, onFileChange, onUpload, onUploadKeyChange, onUploadOpenChange },
    move: {
        moveOpen, targetBucket, targetKey, copyMode,
        onMoveObject, onMoveOpenChange, onCopyModeChange, onTargetBucketChange, onTargetKeyChange,
    },
    onDeleteObject,
    onOpenFolder,
    onRefresh,
    onSearchChange,
    onSelectObject,
}: ObjectBrowserProps) {
    const downloadHref =
        selectedBucket && selectedKey
            ? `/api/internal/s3/objects/download?${new URLSearchParams({ bucket: selectedBucket, key: selectedKey })}`
            : '#'

    return (
        <Card className='flex min-h-0 flex-col overflow-hidden'>
            <div className='shrink-0 border-b border-white/5 px-4 py-3'>
                <div className='flex items-center gap-3'>
                    <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                            <Boxes className='h-4 w-4 shrink-0 text-login' />
                            <h2 className='text-sm font-semibold text-login-50'>
                                {selectedBucket || 'Select a bucket'}
                            </h2>
                        </div>
                        <Breadcrumb prefix={prefix} onOpenFolder={onOpenFolder} />
                    </div>
                    <div className='w-52 shrink-0 -mb-5'>
                        <Input
                            name='search'
                            icon={<Search className='h-4 w-4' />}
                            placeholder='Search objects'
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <Button
                        icon={<RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
                        variant='secondary'
                        onClick={() => void onRefresh()}
                    />
                    <Button
                        text='Upload'
                        icon={<Upload className='h-4 w-4' />}
                        onClick={() => onUploadOpenChange(!uploadOpen)}
                    />
                </div>
            </div>

            {uploadOpen && (
                <div className='shrink-0 border-b border-white/5 bg-login-50/5 px-4 py-3'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='min-w-48 flex-1 -mb-5'>
                            <Input name='file' type='file' onChange={onFileChange} />
                        </div>
                        <div className='w-56 shrink-0 -mb-5'>
                            <Input
                                name='uploadKey'
                                placeholder='Object key (optional)'
                                value={uploadKey}
                                onChange={(e) => onUploadKeyChange(e.target.value)}
                            />
                        </div>
                        <Button
                            text='Upload'
                            icon={<Upload className='h-4 w-4' />}
                            disabled={loading || !selectedBucket || !uploadFile}
                            onClick={() => void onUpload()}
                        />
                        <Button
                            icon={<X className='h-4 w-4' />}
                            variant='secondary'
                            onClick={() => onUploadOpenChange(false)}
                        />
                    </div>
                </div>
            )}

            {selectedObject && (
                <div className='shrink-0 border-b border-white/5 bg-login-50/5 px-4 py-3'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <FileText className='h-4 w-4 shrink-0 text-login-300' />
                        <div className='min-w-0 flex-1'>
                            <div className='truncate font-mono text-xs text-login-50'>{selectedObject.key}</div>
                            <div className='mt-0.5 text-xs text-login-300'>
                                {selectedObject.sizeLabel} · {formatDate(selectedObject.lastModified)}
                            </div>
                        </div>
                        <a
                            href={downloadHref}
                            className='flex h-9 cursor-pointer select-none items-center justify-center gap-2
                                rounded-xl border border-white/5 bg-login-50/5 px-4 text-sm font-medium
                                text-login-50 transition-colors hover:bg-login-50/10'
                        >
                            <ArrowDownToLine className='h-4 w-4' />
                            Download
                        </a>
                        <Button
                            text={moveOpen ? 'Cancel' : 'Move / Copy'}
                            icon={moveOpen
                                ? <X className='h-4 w-4' />
                                : <MoveRight className='h-4 w-4' />}
                            variant='secondary'
                            onClick={() => onMoveOpenChange(!moveOpen)}
                        />
                        <Button
                            text='Delete'
                            icon={<Trash2 className='h-4 w-4' />}
                            variant='danger'
                            onClick={() => void onDeleteObject()}
                        />
                    </div>

                    {moveOpen && (
                        <div className='mt-3 flex flex-wrap items-center gap-3 border-t border-white/5 pt-3'>
                            <Toggle
                                value={copyMode}
                                onChange={(next) => onCopyModeChange(next as boolean)}
                                left={{ value: false, text: 'Move' }}
                                right={{ value: true, text: 'Copy' }}
                            />
                            <div className='w-44 shrink-0 -mb-5'>
                                <Select
                                    name='targetBucket'
                                    value={targetBucket}
                                    placeholder='Target bucket'
                                    options={bucketOptions}
                                    onChange={(val) => onTargetBucketChange(String(val || ''))}
                                />
                            </div>
                            <div className='min-w-32 flex-1 -mb-5'>
                                <Input
                                    name='targetKey'
                                    placeholder='Target key'
                                    value={targetKey}
                                    onChange={(e) => onTargetKeyChange(e.target.value)}
                                />
                            </div>
                            <Button
                                text={copyMode ? 'Copy object' : 'Move object'}
                                icon={copyMode
                                    ? <Copy className='h-4 w-4' />
                                    : <MoveRight className='h-4 w-4' />}
                                disabled={loading || !targetBucket || !targetKey.trim()}
                                onClick={() => void onMoveObject()}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className='min-h-0 flex-1 overflow-auto px-4 pb-4'>
                {!selectedBucket ? (
                    <div className='pt-4'>
                        <div className='rounded-lg border border-dashed border-white/8 p-4 text-xs text-login-300'>
                            Select a bucket from the sidebar to browse its objects.
                        </div>
                    </div>
                ) : (
                    <table className='w-full text-left text-sm'>
                        <thead>
                            <tr className='border-b border-white/5'>
                                <th className='pb-2.5 pr-4 text-[10px] font-semibold uppercase tracking-wider text-login-300'>Name</th>
                                <th className='pb-2.5 pr-4 text-[10px] font-semibold uppercase tracking-wider text-login-300'>Size</th>
                                <th className='pb-2.5 pr-4 text-[10px] font-semibold uppercase tracking-wider text-login-300'>Modified</th>
                                <th className='pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-login-300'>Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prefix && !search && (
                                <ObjectRow
                                    entry={{ type: 'folder', name: '..', key: parentPrefix(prefix), objectCount: 0, sizeBytes: 0 }}
                                    selectedKey={selectedKey}
                                    onOpenFolder={onOpenFolder}
                                    onSelectObject={onSelectObject}
                                />
                            )}
                            {entries.length === 0 && (
                                <tr>
                                    <td colSpan={4} className='pt-4'>
                                        <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                                            {search ? `No objects match '${search}'.` : 'No objects in this location.'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {entries.map((entry) => (
                                <ObjectRow
                                    key={entry.type === 'folder' ? entry.key : entry.object.key}
                                    entry={entry}
                                    selectedKey={selectedKey}
                                    onOpenFolder={onOpenFolder}
                                    onSelectObject={onSelectObject}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedBucket && (
                <div className='shrink-0 border-t border-white/5 px-4 py-2 text-xs text-login-300'>
                    {entries.length} visible · {filteredCount} objects
                </div>
            )}
        </Card>
    )
}

function Breadcrumb({ prefix, onOpenFolder }: { prefix: string; onOpenFolder: (prefix: string) => void }) {
    return (
        <div className='mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-xs'>
            <button
                type='button'
                className='rounded-md border border-white/5 bg-login-50/5 px-2 py-0.5 text-login-300 transition-colors hover:bg-login-50/10'
                onClick={() => onOpenFolder('')}
            >
                root
            </button>
            {prefixSegments(prefix).map((segment) => (
                <button
                    key={segment.path}
                    type='button'
                    className='rounded-md border border-white/5 bg-login-50/5 px-2 py-0.5
                        text-login-300 transition-colors hover:bg-login-50/10'
                    onClick={() => onOpenFolder(segment.path)}
                >
                    {segment.name}
                </button>
            ))}
        </div>
    )
}

function ObjectRow({
    entry,
    selectedKey,
    onOpenFolder,
    onSelectObject,
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
                className='cursor-pointer border-b border-white/5 hover:bg-login-50/5'
                onClick={() => onOpenFolder(entry.key)}
            >
                <td className='py-3 pr-4'>
                    <div className='flex min-w-0 items-center gap-2.5'>
                        {isParent
                            ? <ArrowUp className='h-4 w-4 shrink-0 text-login' />
                            : <Folder className='h-4 w-4 shrink-0 text-login' />}
                        <span className='truncate font-mono text-xs font-medium text-login-50'>
                            {isParent ? 'Parent folder' : entry.name}
                        </span>
                    </div>
                </td>
                <td className='py-3 pr-4 text-xs text-login-300'>
                    {isParent ? '' : formatBytes(entry.sizeBytes)}
                </td>
                <td className='py-3 pr-4 text-xs text-login-300'>
                    {isParent ? '' : `${entry.objectCount} objects`}
                </td>
                <td className='py-3 text-xs text-login-300'>{isParent ? '' : 'folder'}</td>
            </tr>
        )
    }

    const isSelected = selectedKey === entry.object.key
    return (
        <tr
            className={`cursor-pointer border-b border-white/5 transition-colors ${
                isSelected ? 'bg-login/10' : 'hover:bg-login-50/5'
            }`}
            onClick={() => onSelectObject(entry.object)}
        >
            <td className={`py-3 pr-4 border-l-2 ${isSelected ? 'border-l-login pl-3' : 'border-l-transparent pl-0'}`}>
                <div className='flex min-w-0 items-center gap-2.5'>
                    <FileIcon className='h-4 w-4 shrink-0 text-login-300' />
                    <span className='truncate font-mono text-xs text-login-50'>{entry.name}</span>
                </div>
            </td>
            <td className='py-3 pr-4 text-xs text-login-300'>{entry.object.sizeLabel}</td>
            <td className='py-3 pr-4 text-xs text-login-300'>{formatDateTime(entry.object.lastModified)}</td>
            <td className='py-3 text-xs text-login-300'>{entry.object.storageClass || 'standard'}</td>
        </tr>
    )
}
