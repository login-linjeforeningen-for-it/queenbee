'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAllEvents(): Promise<GetAllEventsProps | string> {
    const path = `${config.workerbee.events.path}/all/`
    return await getWrapper({ path, service: 'workerbee' })
}
