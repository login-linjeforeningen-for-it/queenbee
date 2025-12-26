'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postOrganization(body: PostOrganizationProps): Promise<PostOrganizationProps | string> {
    return await postWrapper({ path: config.beehive.organizations, data: body })
}
