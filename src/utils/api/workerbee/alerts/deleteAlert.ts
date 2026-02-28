'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAlert(id: number) {
    return await deleteWrapper({
        path: `alerts/${id}`,
        service: 'workerbee'
    })
}
