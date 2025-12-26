'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getTimeTypes(): Promise<string[] | string> {
    const path = config.workerbee.events.time_types
    return await getWrapper({ path })
}
