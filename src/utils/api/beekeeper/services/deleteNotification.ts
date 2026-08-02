'use server'

import { deleteWrapper } from '@utils/apiWrapper'
import config from '@config'

export default async function deleteNotification(id: number) {
    return await deleteWrapper({ service: 'beekeeper', path: `${config.beekeeper.status.notifications.delete}/${id}` })
}
