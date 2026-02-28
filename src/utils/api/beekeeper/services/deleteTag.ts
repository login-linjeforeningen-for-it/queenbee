'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteTag(id: string): Promise<ServiceNotification[] | string> {
    return await deleteWrapper({
        path: `monitoring/tag/${id}`,
        service: 'beekeeper'
    })
}
