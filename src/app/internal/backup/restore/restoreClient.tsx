'use client'

import { useState } from 'react'
import { DatabaseBackup } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast, Button, Input } from 'uibee/components'
import postBackupRestore from '@utils/api/internal/backups/postBackup'
import GeneralTable, { Column } from '@components/table/generalTable'
import prettyDate from '@utils/date/prettyDate'

interface GroupedBackup extends BackupFileProps {
    locations: ('local' | 'remote')[]
}

export default function RestoreClient({ backups }: { backups: BackupFileProps[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '')
    const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')
    const [restoring, setRestoring] = useState<string | null>(null)

    const groups: Record<string, GroupedBackup> = {}
    backups.forEach((backup) => {
        const key = `${backup.service}-${backup.file}`
        if (!groups[key]) {
            groups[key] = {
                ...backup,
                locations: backup.location ? [backup.location] : []
            }
        } else if (backup.location && !groups[key].locations.includes(backup.location)) {
            groups[key].locations.push(backup.location)
        }
    })
    const groupedBackups = Object.values(groups)

    function updateParams(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        router.push(`${pathname}?${params.toString()}`)
    }

    async function handleRestore(backup: GroupedBackup) {
        if (!backup.service || !backup.file) return
        const key = `${backup.service}-${backup.file}`
        setRestoring(key)
        try {
            const result = await postBackupRestore({ service: backup.service, file: backup.file })
            if (typeof result === 'string') {
                toast.error(`Error: ${result}`)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setRestoring(null)
        }
    }

    const columns: Column<GroupedBackup>[] = [
        {
            header: 'Container',
            accessorKey: 'service',
            className: 'font-medium text-white'
        },
        {
            header: 'Location',
            cell: (backup) => (
                <div className='flex gap-2'>
                    {backup.locations.includes('local') && (
                        <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
                            Local
                        </span>
                    )}
                    {backup.locations.includes('remote') && (
                        <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            bg-sky-500/10 text-sky-400 border border-sky-500/20'>
                            Remote
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Date',
            cell: (backup) => (
                <span className='text-login-200'>
                    {backup.mtime ? prettyDate(backup.mtime) : 'N/A'}
                </span>
            )
        },
        {
            header: 'Size',
            accessorKey: 'size',
            className: 'text-login-200'
        },
        {
            header: 'Action',
            align: 'right',
            className: 'font-medium',
            cell: (backup) => (
                <div className='flex justify-end'>
                    <Button
                        icon={<DatabaseBackup className='w-5' />}
                        text={restoring === `${backup.service}-${backup.file}` ? 'Restoring...' : 'Restore'}
                        onClick={() => handleRestore(backup)}
                        disabled={restoring !== null}
                    />
                </div>
            )
        }
    ]

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-none py-3 flex items-center justify-between gap-4'>
                <div className='flex gap-4 items-center'>
                    <div className='w-64'>
                        <Input
                            name='serviceFilter'
                            type='text'
                            placeholder='Filter by Service'
                            value={serviceFilter}
                            onChange={(e) => {
                                setServiceFilter(String(e.target.value))
                                updateParams('service', String(e.target.value))
                            }}
                        />
                    </div>
                    <div className='w-auto'>
                        <Input
                            name='dateFilter'
                            type='date'
                            placeholder='Filter by Date'
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(String(e.target.value))
                                updateParams('date', String(e.target.value))
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0'>
                <GeneralTable
                    data={groupedBackups}
                    columns={columns}
                    keyExtractor={(item, index) => (item.service && item.file ? `${item.service}-${item.file}` : index)}
                    noDataMessage='No backups found matching filters.'
                />
            </div>
        </div>
    )
}

