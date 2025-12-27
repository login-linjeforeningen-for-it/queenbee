'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putCoverImage(albumId: number, imageName: string): Promise<{ message: string } | string> {
    const path = `${config.workerbee.albums.path}/${albumId}/${imageName}`
    return await putWrapper({ path, service: 'workerbee' })
}
