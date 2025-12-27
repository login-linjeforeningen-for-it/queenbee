'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteRule(id: number) {
    const path = `${config.beehive.rules}/${id}`
    return await deleteWrapper({ path })
}
