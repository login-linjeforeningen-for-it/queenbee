'use client'

import { useState } from 'react'
import Button from '@components/button/button'
import Input from '@components/inputs/input'
import Select from '@components/inputs/select'

export default function BackupClient({ docker }: { docker: Docker }) {
    const dbContainers = docker?.containers?.filter(c =>
        c.name.toLowerCase().includes('postgres') ||
        c.name.toLowerCase().includes('database')
    ) || []

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
                {dbContainers.length > 0 ? (
                    dbContainers.map(container => (
                        <BackupCard key={container.id} container={container} />
                    ))
                ) : (
                    <p>No database containers found.</p>
                )}
            </div>
        </div>
    )
}

function BackupCard({ container }: { container: Container }) {
    const [frequency, setFrequency] = useState('Daily')
    const [time, setTime] = useState('00:00')
    const [retention, setRetention] = useState(30)

    return (
        <div className='bg-login-600 rounded-lg shadow p-6 border border-login-600'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 className='font-bold text-lg'>{container.name}</h3>
                    <p className='text-sm text-login-200'>ID: {container.id.substring(0, 12)}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                    container.status.includes('Up') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {container.status}
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
