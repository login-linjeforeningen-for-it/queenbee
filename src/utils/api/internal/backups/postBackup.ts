'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

type BackupRestoreProps = {
    service: string
    file: string
}

type Response = { message: string }

export default async function postBackupRestore(data: BackupRestoreProps): Promise<Response | string> {
    return await postWrapper({
        path: config.internal.backups.restore,
        data,
        custom: 'system'
    })
}
