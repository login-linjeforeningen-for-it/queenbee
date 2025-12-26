'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postAnnouncement(body: PostAnnouncementProps): Promise<PostAnnouncementProps | string> {
    return await postWrapper({
        path: config.bot.announcements,
        data: body,
        custom: 'tekkom'
    })
}
