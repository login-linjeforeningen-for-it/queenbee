'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getOrganization(id: number): Promise<GetOrganizationProps | string> {
    const path = `${config.beehive.organizations}/${id}`
    return await getWrapper({ path })
}
