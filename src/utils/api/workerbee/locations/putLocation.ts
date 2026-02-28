'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putLocation(id: number, body: PutLocationProps): Promise<PutLocationProps | string> {
    return await putWrapper({
        path: `locations/${id}`,
        data: body,
        service: 'workerbee'
    })
}
