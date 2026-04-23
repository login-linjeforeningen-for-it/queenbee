'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getDocker(): Promise<Docker> {
    const response = await getWrapper({
        path: 'docker',
        service: 'beekeeper'
    })

    if (typeof response === 'string') {
        return {
            status: 'unavailable',
            count: 0,
            containers: [],
            error: response,
        }
    }

    return response
}
