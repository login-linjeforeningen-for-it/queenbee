'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteImage(type: ImagePaths, imageName: string): Promise<string> {
    return await deleteWrapper({
        path: `images/${type}/${imageName}`,
        service: 'workerbee'
    })
}
