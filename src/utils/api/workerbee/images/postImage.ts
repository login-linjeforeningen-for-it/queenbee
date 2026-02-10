'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postImage(type: ImagePaths, file: File): Promise<string | {image: string, name: string}> {
    const path = `${config.workerbee.images.path}/${type}`
    const formData = new FormData()
    formData.append('image', file)

    return await postWrapper({ path, data: formData, service: 'workerbee' })
}
