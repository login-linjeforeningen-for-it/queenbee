'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postAlbum(body: PostAlbumProps): Promise<PostAlbumProps & { id: number } | string> {
    return await postWrapper({
        path: 'albums',
        data: body,
        service: 'workerbee'
    })
}
