'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteContainer(id: number) {
    const path = `${config.internal.docker.path}/${id}`
    return await deleteWrapper({ path, custom: 'system' })
}
