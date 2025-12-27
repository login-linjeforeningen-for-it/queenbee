'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postAlbum(body: PostAlbumProps): Promise<PostAlbumProps & { id: number } | string> {
    return await postWrapper({ path: config.workerbee.albums.path, data: body, service: 'workerbee' })
}
