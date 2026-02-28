'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getLocations({
    type,
    search,
    offset,
    limit,
    orderBy,
    sort
}: GetParamsProps = {}): Promise<GetLocationsProps | string> {
    const queryParts = new URLSearchParams()
    if (type) {
        queryParts.append('type', type)
    }

    if (search) {
        queryParts.append('search', String(search))
    }

    if (offset) {
        queryParts.append('offset', String(offset))
    }

    if (limit) {
        queryParts.append('limit', String(limit))
    }

    if (orderBy) {
        queryParts.append('order_by', String(orderBy))
    }

    if (sort) {
        queryParts.append('sort', String(sort))
    }

    return await getWrapper({
        path: `locations?${queryParts.toString()}`,
        service: 'workerbee'
    })
}
