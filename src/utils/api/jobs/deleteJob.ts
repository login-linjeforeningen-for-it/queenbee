'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteJob(id: number) {
    const path = `${config.workerbee.jobs.path}/${id}`
    return await deleteWrapper({ path })
}
