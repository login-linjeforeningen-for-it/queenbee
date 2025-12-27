'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAlbumImage(albumId: number, imageName: string): Promise<DeleteParamsProps | string> {
    const path = `${config.workerbee.albums.path}/${albumId}/${imageName}`
    return await deleteWrapper({ path })
}
