'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getTrafficDomains() {
    return await getWrapper({ path: config.beekeeper.traffic.domains, custom: 'beekeeper' })
}
