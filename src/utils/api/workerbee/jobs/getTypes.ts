'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getTypes(): Promise<GetJobTypesProps | string> {
    const path = config.workerbee.jobs.types
    return await getWrapper({ path, service: 'workerbee' })
}
