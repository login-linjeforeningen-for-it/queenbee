import getBackupFiles from '@utils/api/internal/backups/getFiles'
import RestoreClient from './restoreClient'

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string, date?: string }> }) {
    const { service, date } = await searchParams
    const backups = await getBackupFiles({ service, date })

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Restore Backup</h1>
            </div>
            <div className='flex-1 overflow-hidden min-h-0'>
                <RestoreClient backups={typeof backups === 'string' ? [] : backups} />
            </div>
        </div>
    )
}

