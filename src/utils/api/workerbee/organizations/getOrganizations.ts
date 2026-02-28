'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getOrganizations({
    search,
    offset,
    limit,
    orderBy,
    sort
}: GetParamsProps = {}): Promise<GetOrganizationsProps | string> {
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

    return await getWrapper({
        path: `organizations?${queryParts.toString()}`,
        service: 'workerbee'
    })
}
