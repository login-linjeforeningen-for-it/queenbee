'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteLocation(id: number) {
    return await deleteWrapper({
        path: `locations/${id}`,
        service: 'workerbee'
    })
}
