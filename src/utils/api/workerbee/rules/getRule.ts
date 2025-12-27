'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getRule(id: number): Promise<GetRuleProps | string> {
    const path = `${config.workerbee.rules.path}/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
