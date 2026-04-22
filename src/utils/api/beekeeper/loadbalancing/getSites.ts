'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getSites() {
    return await getWrapper({
        path: 'sites',
        service: 'beekeeper'
    })
}
