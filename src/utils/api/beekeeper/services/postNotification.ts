'use server'

import { postWrapper } from '@utils/apiWrapper'
import config from '@config'

export default async function postNotification(data: { name: string; message: string; webhook: string }) {
    return await postWrapper({ service: 'beekeeper', path: config.beekeeper.status.notifications.post, data })
}
