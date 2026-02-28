'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAlbumImage(albumId: number, imageName: string): Promise<DeleteParamsProps | string> {
    return await deleteWrapper({
        path: `albums/${albumId}/${imageName}`,
        service: 'workerbee'
    })
}
