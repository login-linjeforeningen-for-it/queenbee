'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAllRules(): Promise<GetAllRulesProps | string> {
    return await getWrapper({
        path: 'rules/all',
        service: 'workerbee'
    })
}
