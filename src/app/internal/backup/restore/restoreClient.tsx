'use client'

import { useState } from 'react'
import Input from '@components/inputs/input'
import Link from 'next/link'
import { ArrowLeft, DatabaseBackup } from 'lucide-react'
import { Button } from 'uibee/components'

export default function RestoreClient() {
    // Mock data for backups
    const [backups] = useState([
        { id: 1, container: 'beekeeper_database', date: '2023-10-27 00:00', size: '1.2 TB' },
        { id: 2, container: 'workerbee_database', date: '2023-10-27 01:00', size: '500 MB' },
        { id: 3, container: 'tekkom_bot_database', date: '2023-10-26 00:00', size: '1.2 GB' },
    ])

    const [serviceFilter, setServiceFilter] = useState('')
    const [dateFilter, setDateFilter] = useState('')

    const filteredBackups = backups.filter(backup => {
        const matchesService = backup.container.toLowerCase().includes(serviceFilter.toLowerCase())
        const matchesDate = dateFilter ? backup.date.startsWith(dateFilter) : true
        return matchesService && matchesDate
    })

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
                        setValue={(v) => setServiceFilter(String(v))}
                    />
                </div>
                <div className='flex-1'>
                    <Input
                        name='dateFilter'
                        type='date'
                        label='Filter by Date'
                        value={dateFilter}
                        setValue={(v) => setDateFilter(String(v))}
                    />
                </div>
            </div>

            <div className='bg-login-600 rounded-lg shadow overflow-hidden border border-login-600'>
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
                    <tbody className='bg-login-600 divide-y divide-login-600'>
                        {filteredBackups.length > 0 ? (
                            filteredBackups.map((backup) => (
                                <tr key={backup.id}>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                                        {backup.container}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-login-200'>
                                        {backup.date}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-login-200'>
                                        {backup.size}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <Button
                                            icon={<DatabaseBackup className='w-5' />}
                                            text='Restore'
                                            onClick={() => alert(`Restoring ${backup.id} (mock)`)}
                                        />
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
