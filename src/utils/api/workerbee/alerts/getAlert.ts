'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAlert(id: number): Promise<GetAlertProps | string> {
    const path = `${config.workerbee.alerts.path}/id/${id}`
    return await getWrapper({ path, service: 'workerbee' })
}
