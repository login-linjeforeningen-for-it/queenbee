import { ArrowUp, File as FileIcon, Folder } from 'lucide-react'
import { formatBytes, formatDateTime } from './helpers'
import type { BrowserEntry, ObjectSummary } from './types'

export default function BrowserRow({
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
            <tr className='cursor-pointer border-t border-white/5 hover:bg-login-50/5' onClick={() => onOpenFolder(entry.key)}>
                <td className='py-2 pr-3'>
                    <div className='flex min-w-0 items-center gap-2 text-white'>
                        {isParent
                            ? <ArrowUp className='h-4 w-4 text-orange-300' />
                            : <Folder className='h-4 w-4 text-orange-300' />}
                        <span className='truncate font-mono text-xs'>{entry.name}</span>
                    </div>
                </td>
                <td className='py-2 pr-3 text-muted-foreground'>{isParent ? '' : formatBytes(entry.sizeBytes)}</td>
                <td className='py-2 pr-3 text-muted-foreground'>{isParent ? '' : `${entry.objectCount} objects`}</td>
                <td className='py-2 text-muted-foreground'>folder</td>
            </tr>
        )
    }

    return (
        <tr
            className={`cursor-pointer border-t border-white/5 ${
                selectedKey === entry.object.key ? 'bg-orange-500/10' : 'hover:bg-login-50/5'
            }`}
            onClick={() => onSelectObject(entry.object)}
        >
            <td className='py-2 pr-3'>
                <div className='flex min-w-0 items-center gap-2 text-white'>
                    <FileIcon className='h-4 w-4 shrink-0 text-login-100' />
                    <span className='truncate font-mono text-xs'>{entry.name}</span>
                </div>
            </td>
            <td className='py-2 pr-3 text-muted-foreground'>{entry.object.sizeLabel}</td>
            <td className='py-2 pr-3 text-muted-foreground'>{formatDateTime(entry.object.lastModified)}</td>
            <td className='py-2 text-muted-foreground'>{entry.object.storageClass || 'standard'}</td>
        </tr>
    )
}
