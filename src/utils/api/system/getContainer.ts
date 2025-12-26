'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getContainer(id: string): Promise<DockerContainer> {
    const path = `${config.internal.docker.path}/${id}`
    return await getWrapper({ path, custom: 'system' })
}
