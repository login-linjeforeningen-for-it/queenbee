'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteEvent(id: number) {
    const path = `${config.workerbee.events.path}/${id}`
    return await deleteWrapper({ path })
}
