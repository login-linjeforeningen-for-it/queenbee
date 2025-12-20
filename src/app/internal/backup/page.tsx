import { getDocker } from '@utils/api'
import BackupClient from './backupClient'

export default async function Page() {
    const docker = await getDocker()

    return <BackupClient docker={docker} />
}
