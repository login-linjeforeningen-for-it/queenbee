'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putJob(id: number, body: PutJobProps): Promise<PutJobProps | string> {
    const path = `${config.workerbee.jobs.path}/${id}`
    return await putWrapper({ path, data: body, service: 'workerbee' })
}
