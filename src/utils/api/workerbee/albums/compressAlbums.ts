'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function compressAlbums(): Promise<{ message: string } | string> {
    const path = `${config.workerbee.albums.path}/compress`
    return await putWrapper({ path, service: 'workerbee' })
}
