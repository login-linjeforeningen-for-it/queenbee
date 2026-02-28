'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putOrganization(id: number, body: PutOrganizationProps): Promise<PutOrganizationProps | string> {
    return await putWrapper({
        path: `organizations/${id}`,
        data: body,
        service: 'workerbee'
    })
}
