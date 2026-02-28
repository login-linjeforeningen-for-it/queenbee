'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postAnnouncement(body: PostAnnouncementProps): Promise<PostAnnouncementProps | string> {
    return await postWrapper({
        path: 'announcements',
        data: body,
        service: 'bot'
    })
}
