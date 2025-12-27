'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postHoney(body: PostHoneyProps): Promise<PostHoneyProps | string> {
    return await postWrapper({ path: config.workerbee.honey.path, data: body, service: 'workerbee' })
}
