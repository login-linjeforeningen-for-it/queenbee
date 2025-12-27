'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAllRules(): Promise<GetAllRulesProps | string> {
    const path = `${config.workerbee.rules.path}/all/`
    return await getWrapper({ path })
}
