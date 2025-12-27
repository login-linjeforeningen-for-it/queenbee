'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putRule(id: number, body: PutRuleProps): Promise<PutRuleProps | string> {
    const path = `${config.workerbee.rules.path}/${id}`
    return await putWrapper({ path, data: body, service: 'workerbee' })
}
