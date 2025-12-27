'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getEvent(id: number): Promise<GetEventProps | string> {
    const path = `${config.workerbee.events.path_protected}/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
