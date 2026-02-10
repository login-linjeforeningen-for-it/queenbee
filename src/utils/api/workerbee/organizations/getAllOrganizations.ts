'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAllOrganizations(): Promise<GetAllOrganizationsProps | string> {
    const path = `${config.workerbee.organizations.path}/all`
    return await getWrapper({ path, service: 'workerbee' })
}
