
'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putAlbum(id: number, body: PutAlbumProps): Promise<PutAlbumProps | string> {
    const path = `${config.workerbee.albums.path}/${id}`
    return await putWrapper({ path, data: body, service: 'workerbee' })
}
