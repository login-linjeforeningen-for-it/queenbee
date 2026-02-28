'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getTrafficDomains() {
    return await getWrapper({
        path: 'traffic/domains',
        service: 'beekeeper'
    })
}
