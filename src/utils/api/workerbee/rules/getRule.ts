'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getRule(id: number): Promise<GetRuleProps | string> {
    return await getWrapper({
        path: `rules/${id}`,
        service: 'workerbee'
    })
}
