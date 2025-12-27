'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getService(id: number): Promise<DetailedService | string> {
    return await getWrapper({ path: `${config.beekeeper.status.services.get}/${id}`, custom: 'beekeeper' })
}
