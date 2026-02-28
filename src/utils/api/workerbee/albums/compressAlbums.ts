'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function compressAlbums(): Promise<{ message: string } | string> {
    return await putWrapper({
        path: 'albums/compress',
        service: 'workerbee'
    })
}
