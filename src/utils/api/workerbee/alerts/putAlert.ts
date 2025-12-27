'use server'

import config from '@config'
import { putWrapper } from '@utils/apiWrapper'

export default async function putAlert(id: number, body: PutAlertProps): Promise<PutAlertProps | string> {
    const path = `${config.workerbee.alerts.path}/${id}`
    return await putWrapper({ path, data: body, service: 'workerbee' })
}
