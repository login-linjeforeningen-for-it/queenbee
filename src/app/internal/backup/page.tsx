import getBackups from '@utils/api/internal/backups/getBackups'
import Alert from '@components/alert/alert'
import formatAlert from '@components/alert/formatAlert'
import Search from '@components/inputs/search'
import { DatabaseBackup } from 'lucide-react'
import { Button } from 'uibee/components'
import GeneralTable, { Column } from '@components/table/generalTable'
import prettyDate from '@utils/date/prettyDate'
import formatNextBackup from '@utils/date/formatNextBackup'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const list = await getBackups()
    const { q } = await searchParams
    const search = typeof q === 'string' ? q.toLowerCase() : ''

    const error = typeof list === 'string' ? list : null
    const backupList = Array.isArray(list) ? list : []

    const backups = backupList.filter(backup =>
        backup.name.toLowerCase().includes(search) ||
        backup.id.toLowerCase().includes(search)
    )

    const columns: Column<BackupProps>[] = [
        {
            header: 'Name',
            cell: (backup) => (
                <div>
                    <div className='text-sm font-medium text-white'>{backup.name}</div>
                    <div className='text-xs text-login-200'>ID: {backup.id.substring(0, 12)}</div>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (backup) => (
                <div className='flex gap-2'>
                    <div className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        backup.status.toLowerCase().includes('up') ? 'bg-green-500/40' : 'bg-red-500/40'
                    }`}>
                        {backup.status}
                    </div>
                    {backup.status.toLowerCase().includes('up') && backup.error &&
                        <div className='px-2 py-1 rounded text-xs font-bold bg-red-500/40 text-white'>
                            {backup.error}
                        </div>
                    }
                </div>
            )
        },
        {
            header: 'Last Backup',
            className: 'text-login-200',
            cell: (backup) => backup.lastBackup ? prettyDate(backup.lastBackup) : 'Never'
        },
        {
            header: 'Next Backup',
            className: 'text-login-200',
            cell: (backup) => formatNextBackup(backup.nextBackup)
        },
        {
            header: 'DB Size',
            accessorKey: 'dbSize',
            className: 'text-login-200'
        },
        {
            header: 'Storage',
            accessorKey: 'totalStorage',
            className: 'text-login-200'
        }
    ]

    return (
        <div className='h-full lg:max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Backup Management</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <Button
                        icon={<DatabaseBackup className='w-5' />}
                        text='Go to Restore'
                        path='/internal/backup/restore'
                        className='self-start'
                    />
                </div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0'>
                {error ? (
                    <div className='h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(error, 'Error loading backups')}
                        </Alert>
                    </div>
                ) : backups.length > 0 ? (
                    <GeneralTable
                        data={backups}
                        columns={columns}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <div className='h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(null, 'No backups found')}
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    )
}



