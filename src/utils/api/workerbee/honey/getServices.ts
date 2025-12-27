'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getHoneyServices(): Promise<string[] | string> {
    const path = config.workerbee.honey.services
    return await getWrapper({ path, service: 'workerbee' })
}
