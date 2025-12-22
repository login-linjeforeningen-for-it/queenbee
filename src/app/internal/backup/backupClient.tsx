'use client'

import { useState } from 'react'
import Button from '@components/button/button'
import Input from '@components/inputs/input'
import Select from '@components/inputs/select'
import formatNextBackup from '@utils/date/formatNextBackup'
import prettyDate from '@utils/date/prettyDate'

export default function BackupClient({ backups }: { backups: BackupProps[] | string }) {
    if (typeof backups === 'string') {
        return (
            <div className='w-full p-4'>
                <p className='text-red-500'>Error: {backups}</p>
            </div>
        )
    }

    return (
        <div className='w-full p-4 space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Backup Management</h1>
                <Button
                    text='Go to Restore'
                    path='/internal/backup/restore'
                />
            </div>

            <div className='grid gap-6'>
                {backups.length > 0 ? (
                    backups.map(backup => (
                        <BackupCard key={backup.id} backup={backup} />
                    ))
                ) : (
                    <p>No backups found.</p>
                )}
            </div>
        </div>
    )
}

function BackupCard({ backup }: { backup: BackupProps }) {
    const [frequency, setFrequency] = useState('Daily')
    const [time, setTime] = useState('00:00')
    const [retention, setRetention] = useState(30)

    return (
        <div className='bg-login-600 rounded-lg shadow p-6 border border-login-600'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 className='font-bold text-lg'>{backup.name}</h3>
                    <p className='text-sm text-login-200'>ID: {backup.id.substring(0, 12)}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                    backup.status.toLowerCase().includes('up') ? 'bg-green-500/40 text-white' : 'bg-red-500/40 text-white'
                }`}>
                    {backup.status}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div className='bg-login-700 p-3 rounded'>
                    <p className='text-xs text-login-200 uppercase'>Last Backup</p>
                    <p className='font-medium'>{backup.lastBackup ? prettyDate(backup.lastBackup) : 'Never'}</p>
                </div>
                <div className='bg-login-700 p-3 rounded'>
                    <p className='text-xs text-login-200 uppercase'>Next Backup</p>
                    <p className='font-medium'>{formatNextBackup(backup.nextBackup)}</p>
                </div>
                <div className='bg-login-700 p-3 rounded'>
                    <p className='text-xs text-login-200 uppercase'>DB Size</p>
                    <p className='font-medium'>{backup.dbSize}</p>
                </div>
                <div className='bg-login-700 p-3 rounded'>
                    <p className='text-xs text-login-200 uppercase'>Total Backup Storage</p>
                    <p className='font-medium'>{backup.totalStorage}</p>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex flex-col'>
                    <Select
                        name='frequency'
                        label='Frequency'
                        value={frequency}
                        setValue={(v) => setFrequency(String(v))}
                        color='bg-login-600'
                        options={[
                            { value: 'Daily', label: 'Daily' },
                            { value: 'Weekly', label: 'Weekly' },
                            { value: 'Monthly', label: 'Monthly' }
                        ]}
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <Input
                        name='time'
                        type='time'
                        label='Time of Day'
                        value={time}
                        setValue={(v) => setTime(String(v))}
                        color='bg-login-600'
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <Input
                        name='retention'
                        type='number'
                        label='Retention (days)'
                        value={retention}
                        setValue={(v) => setRetention(Number(v))}
                        color='bg-login-600'
                        required
                    />
                </div>
            </div>
            <div className='mt-6 flex justify-end'>
                <Button text='Save Settings' onClick={() => alert('Settings saved (mock)')} />
            </div>
        </div>
    )
}
