'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getStats(): Promise<Stats> {
    const path = config.internal.stats
    return await getWrapper({ path, custom: 'system' })
}
