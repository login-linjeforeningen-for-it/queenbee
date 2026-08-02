'use server'

import { putWrapper } from '@utils/apiWrapper'
import config from '@config'

export default async function putNotification(id: number, data: { name: string; message: string; webhook: string }) {
    return await putWrapper({ service: 'beekeeper', path: `${config.beekeeper.status.notifications.put}/${id}`, data })
}
