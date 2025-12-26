'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getServices(): Promise<Service[] | string> {
    return await getWrapper({ path: config.beekeeper.status.services.get, custom: 'beekeeper' })
}
