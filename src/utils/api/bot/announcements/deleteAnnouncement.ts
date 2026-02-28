'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAnnouncement(id: number) {
    return await deleteWrapper({
        path: 'announcements',
        data: { id },
        service: 'bot'
    })
}
