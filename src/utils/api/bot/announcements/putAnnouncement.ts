'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putAnnouncement(body: PutAnnouncementProps): Promise<PutAnnouncementProps | string> {
    return await putWrapper({
        path: 'announcements',
        data: body,
        service: 'bot'
    })
}
