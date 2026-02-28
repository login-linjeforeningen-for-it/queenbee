'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getServices(): Promise<Service[] | string> {
    return await getWrapper({
        path: 'monitoring',
        service: 'beekeeper'
    })
}
