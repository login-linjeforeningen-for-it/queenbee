'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteImage(type: ImagePaths, imageName: string): Promise<string> {
    const path = `${config.workerbee.images.path}/${type}/${imageName}`
    return await deleteWrapper({ path })
}
