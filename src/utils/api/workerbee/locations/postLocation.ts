'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postLocation(body: PostLocationProps): Promise<PostLocationProps | string> {
    return await postWrapper({ path: config.workerbee.locations.path, data: body, service: 'workerbee' })
}
