'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putRule(id: number, body: PutRuleProps): Promise<PutRuleProps | string> {
    return await putWrapper({
        path: `rules/${id}`,
        data: body,
        service: 'workerbee'
    })
}
