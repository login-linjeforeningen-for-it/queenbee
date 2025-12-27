'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getRoles(): Promise<RoleResponse[] | string> {
    const path = config.bot.roles
    return await getWrapper({ path, service: 'bot' })
}
