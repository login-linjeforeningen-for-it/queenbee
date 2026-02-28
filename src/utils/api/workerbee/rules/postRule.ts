'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postRule(body: PostRuleProps): Promise<PostRuleProps | string> {
    return await postWrapper({
        path: 'rules',
        data: body,
        service: 'workerbee'
    })
}
