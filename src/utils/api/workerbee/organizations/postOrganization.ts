'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postOrganization(body: PostOrganizationProps): Promise<PostOrganizationProps | string> {
    return await postWrapper({
        path: 'organizations',
        data: body,
        service: 'workerbee'
    })
}
