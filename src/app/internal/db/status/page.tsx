import getBackups from '@utils/api/internal/backups/getBackups'
import Alert from '@components/alert/alert'
import formatAlert from '@components/alert/formatAlert'
import Search from '@components/inputs/search'
import BackupAllButton from '@components/internal/backupAllButton'
import Table from '@components/table/table'
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
    ).map(backup => ({
        ...backup,
        rawName: backup.name.replace(/_database$/, ''),
        name: (
            <div>
                <div className='text-sm font-medium text-white'>{backup.name}</div>
                <div className='text-xs text-login-200'>ID: {backup.id.substring(0, 12)}</div>
            </div>
        ),
        status: (
            <div className='flex max-w-120 flex-wrap gap-2'>
                <div className={`rounded px-2 py-1 text-xs font-bold text-white ${
                    backup.status.toLowerCase().includes('up') ? 'bg-green-500/40' : 'bg-red-500/40'
                }`}>
                    {backup.status}
                </div>
                {backup.status.toLowerCase().includes('up') && backup.error &&
                    <div className='rounded bg-red-500/40 px-2 py-1 text-xs font-bold text-white wrap-break-word'>
                        {backup.error}
                    </div>
                }
            </div>
        ),
        lastBackup: backup.lastBackup ? prettyDate(backup.lastBackup) : 'Never',
        nextBackup: formatNextBackup(backup.nextBackup)
    }))

    const headers = ['name', 'status', 'lastBackup', 'nextBackup', 'dbSize', 'totalStorage']

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Backup Management</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex gap-2'>
                        <BackupAllButton />
                    </div>
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
                    <Table
                        list={backups}
                        headers={headers}
                        hideMenu={true}
                        redirectPath={{ path: '/internal/backup/restore?service=', key: 'rawName' }}
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
