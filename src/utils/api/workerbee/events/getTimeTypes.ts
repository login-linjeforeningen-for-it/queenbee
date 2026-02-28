'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getTimeTypes(): Promise<string[] | string> {
    return await getWrapper({
        path: 'events/time',
        service: 'workerbee'
    })
}
