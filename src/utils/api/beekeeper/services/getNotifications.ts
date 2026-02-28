'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getNotifications(): Promise<ServiceNotification[] | string> {
    return await getWrapper({
        path: 'monitoring/notifications',
        service: 'beekeeper'
    })
}
