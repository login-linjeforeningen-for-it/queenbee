'use server'

import { getWrapper } from '@utils/apiWrapper'
import { TrafficRecordsProps } from './types'

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

    return await getWrapper({
        path: `traffic/records?${queryParts.toString()}`,
        service: 'beekeeper'
    })
}
