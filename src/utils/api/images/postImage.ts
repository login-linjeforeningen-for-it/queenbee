'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postImage(type: ImagePaths, file: File): Promise<{ status: number, data: string }> {
    const path = `${config.workerbee.images.path}/${type}/`
    const formData = new FormData()
    formData.append('image', file)

    const response = await postWrapper({ path, data: formData, status: true })
    const status = response.status
    const data = response.data
    return { status, data }
}
