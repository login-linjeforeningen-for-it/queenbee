'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postRule(body: PostRuleProps): Promise<PostRuleProps | string> {
    return await postWrapper({ path: config.workerbee.rules.path, data: body, service: 'workerbee' })
}
