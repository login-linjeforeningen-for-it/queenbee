'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAnnouncement(id: number): Promise<GetAnnouncementProps[] | string> {
    const path = `${config.bot.announcements}/?id=${id}`
    return await getWrapper({ path, service: 'bot' })
}
