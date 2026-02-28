'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postImage(type: ImagePaths, file: File): Promise<string | {image: string, name: string}> {
    const formData = new FormData()
    formData.append('image', file)

    return await postWrapper({
        path: `images/${type}`,
        data: formData,
        service: 'workerbee'
    })
}
