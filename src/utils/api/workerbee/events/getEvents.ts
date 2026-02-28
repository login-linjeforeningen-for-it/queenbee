'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getEvents({
    search,
    offset,
    limit,
    orderBy,
    sort,
    historical
}: GetParamsProps): Promise<GetEventsProps | string> {
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
        path: `events/protected?${queryParts.toString()}`,
        service: 'workerbee'
    })
}
