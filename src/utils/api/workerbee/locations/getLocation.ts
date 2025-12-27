'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getLocation(id: number): Promise<GetLocationProps | string> {
    const path = `${config.workerbee.locations.path}/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
