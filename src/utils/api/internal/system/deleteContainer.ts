'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteContainer(id: number) {
    return await deleteWrapper({
        path: `docker/${id}`,
        service: 'beekeeper'
    })
}
