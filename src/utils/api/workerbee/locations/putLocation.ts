'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putLocation(id: number, body: PutLocationProps): Promise<PutLocationProps | string> {
    const path = `${config.workerbee.locations.path}/${id}`
    return await putWrapper({ path, data: body })
}
