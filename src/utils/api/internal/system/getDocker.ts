'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getDocker(): Promise<Docker> {
    const path = config.internal.docker.path
    return await getWrapper({ path, custom: 'system' })
}
