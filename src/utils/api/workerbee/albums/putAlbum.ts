
'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putAlbum(id: number, body: PutAlbumProps): Promise<PutAlbumProps | string> {
    return await putWrapper({
        path: `albums/${id}`,
        data: body,
        service: 'workerbee'
    })
}
