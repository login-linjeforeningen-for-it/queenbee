import { getBackupFiles } from '@utils/api'
import RestoreClient from './restoreClient'

export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string, date?: string }> }) {
    const { service, date } = await searchParams
    const backups = await getBackupFiles({ service, date })

    return <RestoreClient backups={typeof backups === 'string' ? [] : backups} />
}
