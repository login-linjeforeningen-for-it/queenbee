import getBackups from '@utils/api/internal/backups/getBackups'
import { SearchInput, type Column } from 'uibee/components'
import BackupAllButton from '@components/internal/backupAllButton'
import ManagedTable from '@components/table/managedTable'
import prettyDate from '@utils/date/prettyDate'
import getBackupFiles from '@utils/api/internal/backups/getFiles'
import BackupFileTable from '@components/db/fileTable'

const columns: Column[] = [
    { key: 'name' },
    { key: 'status', highlight: { running: 'green', stopped: 'red' } },
    { key: 'lastBackup' },
    { key: 'totalStorage' },
    { key: 'error' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const list = await getBackups()
    const { q } = await searchParams
    const search = typeof q === 'string' ? q.toLowerCase() : ''

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

        const fileRows = groupedFiles.map((file, index) => ({
            _id: `${file.file || 'file'}-${index}`,
            date: file.mtime ? prettyDate(file.mtime) : 'Unknown date',
            location: file.locations,
            size: file.size || 'Unknown size',
            name: file.file || 'Unknown file',
        }))

        return {
            ...backup,
            backupDetails: groupedFiles.length > 0 ? (
                <BackupFileTable rows={fileRows} />
            ) : (
                <div className='px-2 py-1 text-sm text-login-200'>No backups taken</div>
            ),
            name: (
                <div>
                    <div className='text-sm font-medium text-white'>{backup.name}</div>
                    <div className='text-xs text-login-200'>ID: {backup.id.substring(0, 12)}</div>
                </div>
            ),
            status: backup.status.toLowerCase().includes('up') ? 'running' : 'stopped',
            error: backup.error || null,
            lastBackup: backup.lastBackup ? prettyDate(backup.lastBackup) : 'Never',
        }
    })

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Backup Management</h1>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <div className='flex gap-2'>
                        <BackupAllButton />
                    </div>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto min-h-0'>
                <ManagedTable
                    data={backups as unknown as Record<string, unknown>[]}
                    columns={columns}
                    rawKeys={['name']}
                    expandKey='backupDetails'
                    idKey='id'
                    hidePagination
                />
            </div>
        </div>
    )
}
