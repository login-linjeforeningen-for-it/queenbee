'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putOrganization(id: number, body: PutOrganizationProps): Promise<PutOrganizationProps | string> {
    const path = `${config.workerbee.organizations.path}/${id}`
    return await putWrapper({ path, data: body })
}
