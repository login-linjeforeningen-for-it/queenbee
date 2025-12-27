'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getBackupFiles({ service, date }: GetBackupFilesProps): Promise<BackupFileProps[] | string> {
    const queryParts = new URLSearchParams()
    if (service) {
        queryParts.append('service', service)
    }

    if (date) {
        queryParts.append('date', date)
    }

    return await getWrapper({
        path: `${config.internal.backups.files}?${queryParts.toString()}`,
        custom: 'system'
    })
}
