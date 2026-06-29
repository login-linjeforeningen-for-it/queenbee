'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postNotification(data: { name: string; message: string; webhook: string }) {
    return await postWrapper({ service: 'beekeeper', path: 'monitoring/notifications', data })
}
