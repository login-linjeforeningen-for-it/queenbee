'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAlert(id: number): Promise<GetAlertProps | string> {
    return await getWrapper({
        path: `alerts/id/${id}`,
        service: 'workerbee'
    })
}
