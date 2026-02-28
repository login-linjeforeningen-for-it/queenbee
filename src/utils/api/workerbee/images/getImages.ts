'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getImages(type: 'events' | 'jobs' | 'organizations'): Promise<string[] | string> {
    return await getWrapper({
        path: `images/${type}`,
        service: 'workerbee'
    })
}
