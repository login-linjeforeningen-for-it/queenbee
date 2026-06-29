'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteNotification(id: number) {
    return await deleteWrapper({ service: 'beekeeper', path: `monitoring/notifications/${id}` })
}
