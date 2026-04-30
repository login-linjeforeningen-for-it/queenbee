import getBackups from '@utils/api/internal/backups/getBackups'
import Alert from '@components/alert/alert'
import formatAlert from '@components/alert/formatAlert'
import Search from '@components/inputs/search'
import BackupAllButton from '@components/internal/backupAllButton'
import Table from '@components/table/table'
import prettyDate from '@utils/date/prettyDate'
import formatNextBackup from '@utils/date/formatNextBackup'
import getBackupFiles from '@utils/api/internal/backups/getFiles'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const list = await getBackups()
    const { q } = await searchParams
    const search = typeof q === 'string' ? q.toLowerCase() : ''

    const error = typeof list === 'string' ? list : null
    const backupList = Array.isArray(list) ? list : []
    const services = [...new Set(backupList.map(backup => backup.name.replace(/_database$/, '')))]
    const backupFilesByService = new Map<string, BackupFileProps[]>()

    await Promise.all(services.map(async (service) => {
        const files = await getBackupFiles({ service })
        if (typeof files === 'string') {
            backupFilesByService.set(service, [])
            return
        }

        backupFilesByService.set(
            service,
            files.sort((a, b) => {
                const aTime = a.mtime ? new Date(a.mtime).getTime() : 0
                const bTime = b.mtime ? new Date(b.mtime).getTime() : 0
                return bTime - aTime
            })
        )
    }))

    const backups = backupList.filter(backup =>
        backup.name.toLowerCase().includes(search) ||
        backup.id.toLowerCase().includes(search)
    ).map(backup => {
        const serviceName = backup.name.replace(/_database$/, '')
        const files = backupFilesByService.get(serviceName) || []
        const groupedFiles = Object.values(
            files.reduce<Record<string, {
                file?: string
                size?: string
                mtime?: string
                locations: Array<'local' | 'remote'>
            }>>((acc, file) => {
                const key = file.file || 'unknown'
                if (!acc[key]) {
                    acc[key] = {
                        file: file.file,
                        size: file.size,
                        mtime: file.mtime,
                        locations: []
                    }
                }
                if (!acc[key].size && file.size) {
                    acc[key].size = file.size
                }
                if (!acc[key].mtime && file.mtime) {
                    acc[key].mtime = file.mtime
                }

                if (file.location && !acc[key].locations.includes(file.location)) {
                    acc[key].locations.push(file.location)
                }

                return acc
            }, {})
        )

        return {
            ...backup,
            backupDetails: groupedFiles.length > 0 ? (
                <div className='w-full'>
                    <div className='grid grid-cols-4 gap-3 px-2 pb-2 text-[11px] font-semibold uppercase text-login-300'>
                        <span>Date</span>
                        <span>Location</span>
                        <span>Size</span>
                        <span>Name</span>
                    </div>
                    <div className='space-y-1'>
                        {groupedFiles.map((file, index) => (
                            <div
                                key={`${file.file || 'file'}-${index}`}
                                className='grid grid-cols-4 gap-3 rounded bg-login-700/30 px-2 py-2 text-xs text-login-100'
                            >
                                <span>{file.mtime ? prettyDate(file.mtime) : 'Unknown date'}</span>
                                <span className='flex items-center gap-2'>
                                    {file.locations.includes('remote') && (
                                        <span className='rounded bg-orange-500/20 px-2 py-0.5 text-orange-300'>Offsite</span>
                                    )}
                                    {file.locations.includes('local') && (
                                        <span className='rounded bg-login-400/30 px-2 py-0.5 text-login-200'>Onsite</span>
                                    )}
                                    {file.locations.length === 0 && <span>Unknown</span>}
                                </span>
                                <span>{file.size || 'Unknown size'}</span>
                                <span className='truncate'>{file.file || 'Unknown file'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='px-2 py-1 text-sm text-login-200'>No backups taken</div>
            ),
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
        }
    })

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
                        expandableRowKey='backupDetails'
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
