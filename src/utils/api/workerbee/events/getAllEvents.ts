'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAllEvents(): Promise<GetAllEventsProps | string> {
    return await getWrapper({
        path: 'events/all',
        service: 'workerbee'
    })
}
