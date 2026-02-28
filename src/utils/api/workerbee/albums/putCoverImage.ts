'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putCoverImage(albumId: number, imageName: string): Promise<{ message: string } | string> {
    return await putWrapper({
        path: `albums/${albumId}/${imageName}`,
        service: 'workerbee'
    })
}
