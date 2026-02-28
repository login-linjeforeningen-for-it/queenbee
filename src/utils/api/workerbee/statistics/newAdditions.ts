'use server'

import { getWrapper } from '@utils/apiWrapper'

type APIProps = {
    limit?: number
}

export default async function getStatisticsNewAdditions({limit}: APIProps): Promise<GetStatisticsNewAdditionsProps | string> {
    const queryParts = new URLSearchParams()

    if (limit) {
        queryParts.append('limit', String(limit))
    }

    return await getWrapper({
        path: `stats/new-additions?${queryParts.toString()}`,
        service: 'workerbee'
    })
}
