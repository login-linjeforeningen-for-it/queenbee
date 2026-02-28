'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getStats(): Promise<Stats> {
    return await getWrapper({
        path: 'stats',
        service: 'internal'
    })
}
