'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getBackups(): Promise<BackupProps[] | string> {
    return await getWrapper({ path: config.internal.backups.get, service: 'internal' })
}
