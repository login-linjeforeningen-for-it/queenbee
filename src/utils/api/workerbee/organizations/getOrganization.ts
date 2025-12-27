'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getOrganization(id: number): Promise<GetOrganizationProps | string> {
    const path = `${config.workerbee.organizations.path}/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
