'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteRule(id: number) {
    const path = `${config.workerbee.rules.path}/${id}`
    return await deleteWrapper({ path })
}
