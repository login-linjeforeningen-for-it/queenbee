'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putAlert(id: number, body: PutAlertProps): Promise<PutAlertProps | string> {
    return await putWrapper({
        path: `alerts/${id}`,
        data: body,
        service: 'workerbee'
    })
}
