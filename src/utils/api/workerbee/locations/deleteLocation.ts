'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteLocation(id: number) {
    const path = `${config.workerbee.locations.path}/${id}`
    return await deleteWrapper({ path })
}
