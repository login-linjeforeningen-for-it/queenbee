'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteTag(id: string): Promise<ServiceNotification[] | string> {
    return await deleteWrapper({ path: `${config.beekeeper.status.tags.delete}/${id}`, custom: 'beekeeper' })
}
