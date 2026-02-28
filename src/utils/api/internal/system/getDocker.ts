'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getDocker(): Promise<Docker> {
    return await getWrapper({
        path: 'docker',
        service: 'internal'
    })
}
