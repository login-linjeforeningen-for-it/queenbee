import { getBackups } from '@utils/api'
import BackupClient from './backupClient'

export default async function Page() {
    const backups = await getBackups()

    return <BackupClient backups={backups} />
}
