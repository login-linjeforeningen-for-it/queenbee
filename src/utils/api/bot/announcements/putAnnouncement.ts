'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putAnnouncement(body: PutAnnouncementProps): Promise<PutAnnouncementProps | string> {
    return await putWrapper({
        path: config.bot.announcements,
        data: body,
        service: 'bot'
    })
}
