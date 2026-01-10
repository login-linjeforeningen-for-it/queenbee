'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAnnouncement(id: number) {
    const path = config.bot.announcements
    return await deleteWrapper({
        path,
        data: { id },
        service: 'bot'
    })
}
