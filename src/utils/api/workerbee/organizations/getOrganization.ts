'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getOrganization(id: number): Promise<GetOrganizationProps | string> {
    return await getWrapper({
        path: `organizations/${id}`,
        service: 'workerbee'
    })
}
