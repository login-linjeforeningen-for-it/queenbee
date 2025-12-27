'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getNotifications(): Promise<ServiceNotification[] | string> {
    return await getWrapper({ path: config.beekeeper.status.notifications.get, service: 'beekeeper' })
}
