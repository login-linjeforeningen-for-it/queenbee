'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getRoles(): Promise<RoleResponse[] | string> {
    return await getWrapper({ 
        path: 'roles',
        service: 'bot'
    })
}
