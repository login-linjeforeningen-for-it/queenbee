'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteHoney(id: number) {
    return await deleteWrapper({
        path: `honeys/${id}`,
        service: 'workerbee'
    })
}
