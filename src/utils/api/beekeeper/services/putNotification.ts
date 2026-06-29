'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putNotification(id: number, data: { name: string; message: string; webhook: string }) {
    return await putWrapper({ service: 'beekeeper', path: `monitoring/notifications/${id}`, data })
}
