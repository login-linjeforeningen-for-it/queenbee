import { getBackups } from '@utils/api'
import formatNextBackup from '@utils/date/formatNextBackup'
import prettyDate from '@utils/date/prettyDate'
import { DatabaseBackup } from 'lucide-react'
import { Button } from 'uibee/components'

export default async function Page() {
    const backups = await getBackups()

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
                    icon={<DatabaseBackup className='w-5' />}
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
        </div>
    )
}
