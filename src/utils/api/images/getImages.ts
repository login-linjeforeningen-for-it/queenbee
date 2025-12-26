'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getImages(type: 'events' | 'jobs' | 'organizations'): Promise<string[] | string> {
    const path = `${config.workerbee.images.path}/${type}`
    return await getWrapper({ path })
}
