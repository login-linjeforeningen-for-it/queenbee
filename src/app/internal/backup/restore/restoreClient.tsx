'use client'

import { useState } from 'react'
import Input from '@components/inputs/input'
import Link from 'next/link'
import { ArrowLeft, DatabaseBackup } from 'lucide-react'
import { Button } from 'uibee/components'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import postBackupRestore from '@utils/api/internal/backups/postBackup'

export default function RestoreClient({ backups }: { backups: BackupFileProps[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '')
    const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')
    const [restoring, setRestoring] = useState<string | null>(null)

    const updateParams = (key: string, value: string) => {
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

    return (
        <div className='w-full p-4 space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Restore Backup</h1>
                <Link href='/internal/backup'>
                    <Button icon={<ArrowLeft className='w-5' />} text='Back to Settings' />
                </Link>
            </div>

            <div className='flex gap-4 mb-4'>
                <div className='flex-1'>
                    <Input
                        name='serviceFilter'
                        type='text'
                        label='Filter by Service'
                        value={serviceFilter}
                        setValue={(v) => {
                            setServiceFilter(String(v))
                            updateParams('service', String(v))
                        }}
                    />
                </div>
                <div className='flex-1'>
                    <Input
                        name='dateFilter'
                        type='date'
                        label='Filter by Date'
                        value={dateFilter}
                        setValue={(v) => {
                            setDateFilter(String(v))
                            updateParams('date', String(v))
                        }}
                    />
                </div>
            </div>

            <div className='bg-login-50/5 rounded-lg shadow overflow-hidden border border-login-600'>
                <table className='min-w-full divide-y divide-login-600'>
                    <thead className='bg-login-700'>
                        <tr>
                            <th className={
                                'px-6 py-3 text-left text-xs font-medium text-login-200 uppercase tracking-wider'
                            }>
                                Container
                            </th>
                            <th className={
                                'px-6 py-3 text-left text-xs font-medium text-login-200 uppercase tracking-wider'
                            }>
                                Date
                            </th>
                            <th className={
                                'px-6 py-3 text-left text-xs font-medium text-login-200 uppercase tracking-wider'
                            }>
                                Size
                            </th>
                            <th className={
                                'px-6 py-3 text-right text-xs font-medium text-login-200 uppercase tracking-wider'
                            }>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-login-50/5 divide-y divide-login-600'>
                        {backups.length > 0 ? (
                            backups.map((backup, index) => (
                                <tr key={backup.file || index}>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                                        {backup.service}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-login-200'>
                                        {backup.mtime}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-login-200'>
                                        {backup.size}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap flex justify-end text-sm font-medium'>
                                        <div className='flex justify-end w-1'>
                                            <Button
                                                icon={<DatabaseBackup className='w-5' />}
                                                text={restoring === backup.file ? 'Restoring...' : 'Restore'}
                                                onClick={() => handleRestore(backup)}
                                                disabled={restoring !== null}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='px-6 py-4 text-center text-sm text-login-200'>
                                    No backups found matching filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
