'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteEvent(id: number) {
    return await deleteWrapper({
        path: `events/${id}`,
        service: 'workerbee'
    })
}
