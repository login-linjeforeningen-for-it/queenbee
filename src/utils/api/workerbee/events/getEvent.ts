'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getEvent(id: number): Promise<GetEventProps | string> {
    return await getWrapper({
        path: `events/protected/${id}`,
        service: 'workerbee'
    })
}
