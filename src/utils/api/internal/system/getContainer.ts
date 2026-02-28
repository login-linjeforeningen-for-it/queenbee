'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getContainer(id: string): Promise<DockerContainer> {
    return await getWrapper({
        path: `docker/${id}`,
        service: 'internal'
    })
}
