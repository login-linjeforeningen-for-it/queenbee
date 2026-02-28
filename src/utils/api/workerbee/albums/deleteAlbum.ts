'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAlbum(id: number) {
    return await deleteWrapper({
        path: `albums/${id}`,
        service: 'workerbee'
    })
}
