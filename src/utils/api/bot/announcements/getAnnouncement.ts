'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAnnouncement(id: number): Promise<GetAnnouncementProps[] | string> {
    return await getWrapper({
        path: `announcements?id=${id}`,
        service: 'bot'
    })
}
