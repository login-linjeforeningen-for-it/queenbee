'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getRule(id: number): Promise<GetRuleProps | string> {
    const path = `${config.beehive.rules}/${id}`
    return await getWrapper({ path })
}
