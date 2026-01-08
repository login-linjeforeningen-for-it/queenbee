'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAnnouncements({
    search, offset, limit, orderBy, sort
}: GetParamsProps & { includePlaceholders?: boolean } = {}): Promise<GetAnnouncementsProps | string> {
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

    queryParts.append('includePlaceholders', 'true')

    const path = `${config.bot.announcements}?${queryParts.toString()}`
    const data = await getWrapper({ path, service: 'bot' })
    return data
}
