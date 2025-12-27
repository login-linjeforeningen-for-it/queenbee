'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

type GetTrafficRecordsProps = {
    start?: string
    end?: string
    limit?: number
    page?: number
    domain?: string
}

export default async function getTrafficRecords({
    start,
    end,
    limit,
    page,
    domain
}: GetTrafficRecordsProps): Promise<TrafficRecordsProps | string> {
    const queryParts = new URLSearchParams()
    if (start) {
        queryParts.append('start', start)
    }

    if (end) {
        queryParts.append('end', end)
    }

    if (limit) {
        queryParts.append('limit', String(limit))
    }

    if (page) {
        queryParts.append('page', String(page))
    }

    if (domain) {
        queryParts.append('domain', domain)
    }

    const path = `${config.beekeeper.traffic.records}?${queryParts.toString()}`
    return await getWrapper({ path, service: 'beekeeper' })
}
