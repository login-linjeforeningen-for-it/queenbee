'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putHoney(id: number, body: PutHoneyProps): Promise<PutHoneyProps | string> {
    const path = `${config.workerbee.honey.path}/${id}`
    return await putWrapper({ path, data: body, service: 'workerbee' })
}
