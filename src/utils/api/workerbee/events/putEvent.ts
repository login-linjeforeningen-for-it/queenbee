'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putEvent(id: number, body: PutEventProps): Promise<PutEventProps | string> {
    const path = `${config.workerbee.events.path}/${id}`
    return await putWrapper({ path, data: body })
}
