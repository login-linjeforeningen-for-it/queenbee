import getBackups from '@utils/api/internal/backups/getBackups'
import formatNextBackup from '@utils/date/formatNextBackup'
import prettyDate from '@utils/date/prettyDate'
import Alert from '@components/alert/alert'
import formatAlert from '@components/alert/formatAlert'
import { DatabaseBackup } from 'lucide-react'
import { Button } from 'uibee/components'

export default async function Page() {
    const backups = await getBackups()

    if (typeof backups === 'string') {
        return (
            <div className='w-full p-4'>
                <Alert>
                    {formatAlert(backups, 'Error loading backups')}
                </Alert>
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
                    <Alert>
                        {formatAlert(null, 'No backups found')}
                    </Alert>
                )}
            </div>
        </div>
    )
}

function BackupCard({ backup }: { backup: BackupProps }) {
    return (
        <div className='bg-login-50/5 rounded-lg shadow p-6 border border-login-600'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <h3 className='font-bold text-lg'>{backup.name}</h3>
                    <p className='text-sm text-login-200'>ID: {backup.id.substring(0, 12)}</p>
                </div>
                <div className='flex gap-2'>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                        backup.status.toLowerCase().includes('up') ? 'bg-green-500/40 text-white' : 'bg-red-500/40 text-white'
                    }`}>
                        {backup.status}
                    </div>
                    {backup.status.toLowerCase().includes('up') && backup.error &&
                        <div className='px-2 py-1 rounded text-xs font-bold bg-red-500/40 text-white'>
                            {backup.error}
                        </div>
                    }
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
                    <p className='text-xs text-login-200 uppercase'>Database Size</p>
                    <p className='font-medium'>{backup.dbSize}</p>
                </div>
                <div className='bg-login-700 p-3 rounded'>
                    <p className='text-xs text-login-200 uppercase'>Backup Storage Used</p>
                    <p className='font-medium'>{backup.totalStorage}</p>
                </div>
            </div>
        </div>
    )
}
