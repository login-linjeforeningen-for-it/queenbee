'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putEvent(id: number, body: PutEventProps): Promise<PutEventProps | string> {
    return await putWrapper({
        path: `events/${id}`,
        data: body,
        service: 'workerbee'
    })
}
