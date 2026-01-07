'use client'

import { useState } from 'react'
import { DatabaseBackup } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast, Button, Input } from 'uibee/components'
import postBackupRestore from '@utils/api/internal/backups/postBackup'
import GeneralTable, { Column } from '@components/table/generalTable'

export default function RestoreClient({ backups }: { backups: BackupFileProps[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '')
    const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')
    const [restoring, setRestoring] = useState<string | null>(null)

    function updateParams(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        router.push(`${pathname}?${params.toString()}`)
    }

    async function handleRestore(backup: BackupFileProps) {
        if (!backup.service || !backup.file) return
        setRestoring(backup.file)
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

    const columns: Column<BackupFileProps>[] = [
        {
            header: 'Container',
            accessorKey: 'service',
            className: 'font-medium text-white'
        },
        {
            header: 'Date',
            accessorKey: 'mtime',
            className: 'text-login-200'
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
                        text={restoring === backup.file ? 'Restoring...' : 'Restore'}
                        onClick={() => handleRestore(backup)}
                        disabled={restoring !== null}
                    />
                </div>
            )
        }
    ]

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex gap-4 mb-4'>
                <div className='flex-1'>
                    <Input
                        name='serviceFilter'
                        type='text'
                        label='Filter by Service'
                        value={serviceFilter}
                        onChange={(e) => {
                            setServiceFilter(String(e.target.value))
                            updateParams('service', String(e.target.value))
                        }}
                    />
                </div>
                <div className='flex-1'>
                    <Input
                        name='dateFilter'
                        type='date'
                        label='Filter by Date'
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(String(e.target.value))
                            updateParams('date', String(e.target.value))
                        }}
                    />
                </div>
            </div>

            <GeneralTable
                data={backups}
                columns={columns}
                keyExtractor={(item, index) => item.file || index}
                noDataMessage='No backups found matching filters.'
            />
        </div>
    )
}

