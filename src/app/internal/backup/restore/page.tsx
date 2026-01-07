import getBackupFiles from '@utils/api/internal/backups/getFiles'
import RestoreClient from './restoreClient'
import { ArrowLeft } from 'lucide-react'
import { Button } from 'uibee/components'

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string, date?: string }> }) {
    const { service, date } = await searchParams
    const backups = await getBackupFiles({ service, date })

    return (
        <div className='h-full lg:max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Restore Backup</h1>
                <div className='flex items-center justify-end py-3'>
                    <Button
                        icon={<ArrowLeft className='w-5' />}
                        text='Back to Settings'
                        path='/internal/backup'
                    />
                </div>
            </div>
            <div className='flex-1 overflow-y-auto min-h-0'>
                <RestoreClient backups={typeof backups === 'string' ? [] : backups} />
            </div>
        </div>
    )
}

