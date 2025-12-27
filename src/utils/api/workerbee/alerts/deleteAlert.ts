'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteAlert(id: number) {
    const path = `${config.workerbee.alerts.path}/${id}`
    return await deleteWrapper({ path, service: 'workerbee' })
}
