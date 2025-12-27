'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function getShareURLs(id: number, body: { filename: string, type: string }[]): Promise<ShareURLResponse[] | string> {
    return await postWrapper({ path: `${config.workerbee.albums.path}/${id}`, data: body, service: 'workerbee' })
}
