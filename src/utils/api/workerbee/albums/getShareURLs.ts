'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function getShareURLs(id: number, body: { filename: string, type: string }[]): Promise<ShareURLResponse[] | string> {
    return await postWrapper({
        path: `albums/${id}`,
        data: body,
        service: 'workerbee'
    })
}
