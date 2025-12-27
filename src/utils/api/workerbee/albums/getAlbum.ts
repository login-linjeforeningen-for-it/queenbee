'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAlbum(id: number): Promise<GetAlbumProps | string> {
    const path = `${config.workerbee.albums.path}/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
