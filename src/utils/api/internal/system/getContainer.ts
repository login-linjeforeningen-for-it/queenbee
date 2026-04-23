'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getContainer(id: string): Promise<DockerContainer | string> {
    return await getWrapper({
        path: `docker/${id}`,
        service: 'beekeeper'
    })
}
