'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postJob(body: PostJobProps): Promise<PostJobProps | string> {
    return await postWrapper({ path: config.workerbee.jobs.path, data: body })
}
