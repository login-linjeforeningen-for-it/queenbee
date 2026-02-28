'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getService(id: number): Promise<DetailedService | string> {
    return await getWrapper({
        path: `monitoring/${id}`,
        service: 'beekeeper'
    })
}
