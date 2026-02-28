'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getJobs({
    search,
    limit,
    offset,
    orderBy,
    sort,
    historical
}: GetParamsProps = {}): Promise<GetJobsProps | string> {
    const queryParts = new URLSearchParams()
    if (search) {
        queryParts.append('search', String(search))
    }

    if (limit) {
        queryParts.append('limit', String(limit))
    }

    if (offset) {
        queryParts.append('offset', String(offset))
    }

    if (orderBy) {
        queryParts.append('order_by', String(orderBy))
    }

    if (sort) {
        queryParts.append('sort', String(sort))
    }

    if (historical) {
        queryParts.append('historical', String(historical))
    }

    return await getWrapper({
        path: `jobs/protected?${queryParts.toString()}`,
        service: 'workerbee'
    })
}
