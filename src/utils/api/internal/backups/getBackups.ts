'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getBackups(): Promise<BackupProps[] | string> {
    return await getWrapper({
        path: 'backup',
        service: 'beekeeper'
    })
}
