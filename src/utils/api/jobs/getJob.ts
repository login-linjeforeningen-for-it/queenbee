'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getJob(id: number): Promise<GetJobProps | string> {
    const path = `${config.workerbee.jobs.path_protected}/${id}`
    return await getWrapper({ path })
}
