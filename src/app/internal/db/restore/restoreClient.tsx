'use client'

import { useState } from 'react'
import { DatabaseBackup } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast, Button, Input } from 'uibee/components'
import postBackupRestore from '@utils/api/internal/backups/postBackup'
import Table from '@components/table/table'
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

    const tableList: Record<string, React.ReactNode | string | number>[] = groupedBackups.map((backup) => ({
        container: <span className='font-medium text-white'>{backup.service}</span>,
        location: (
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
        ),
        date: <span className='text-login-200'>{backup.mtime ? prettyDate(backup.mtime) : 'N/A'}</span>,
        size: <span className='text-login-200'>{backup.size}</span>,
        action: (
            <div className='flex justify-end w-full'>
                <Button
                    icon={<DatabaseBackup className='w-5' />}
                    text={restoring === `${backup.service}-${backup.file}` ? 'Restoring...' : 'Restore'}
                    onClick={() => handleRestore(backup)}
                    disabled={restoring !== null}
                    className='text-login-50'
                />
            </div>
        )
    }))

    const headers = ['container', 'location', 'date', 'size', 'action']

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

            <div className='flex-1 min-h-0 flex flex-col'>
                <Table
                    list={tableList}
                    headers={headers}
                    hideMenu={true}
                />
            </div>
        </div>
    )
}

