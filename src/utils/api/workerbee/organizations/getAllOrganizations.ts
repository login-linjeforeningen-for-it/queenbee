'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAllOrganizations(): Promise<GetAllOrganizationsProps | string> {
    return await getWrapper({
        path: 'organizations/all',
        service: 'workerbee'
    })
}
