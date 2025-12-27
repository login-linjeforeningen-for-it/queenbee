'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAudiences(): Promise<GetAudiencesProps | string> {
    const path = config.workerbee.events.audiences
    return await getWrapper({ path, service: 'workerbee' })
}
