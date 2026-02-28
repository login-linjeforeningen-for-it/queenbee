'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putHoney(id: number, body: PutHoneyProps): Promise<PutHoneyProps | string> {
    return await putWrapper({
        path: `honeys/${id}`,
        data: body,
        service: 'workerbee'
    })
}
