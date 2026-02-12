'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

type APIProps = {
    limit?: number
}

export default async function getStatisticsNewAdditions({limit}: APIProps): Promise<GetStatisticsNewAdditionsProps | string> {
    const queryParts = new URLSearchParams()

    if (limit) {
        queryParts.append('limit', String(limit))
    }

    const path = `${config.workerbee.statistics.path}/new-additions?${queryParts.toString()}`
    return await getWrapper({ path, service: 'workerbee' })
}
