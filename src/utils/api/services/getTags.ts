'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getTags(): Promise<Tag[] | string> {
    return await getWrapper({ path: config.beekeeper.status.tags.get, custom: 'beekeeper' })
}
