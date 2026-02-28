'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAlbum(id: number): Promise<GetAlbumProps | string> {
    return await getWrapper({
        path: `albums/${id}`,
        service: 'workerbee'
    })
}
