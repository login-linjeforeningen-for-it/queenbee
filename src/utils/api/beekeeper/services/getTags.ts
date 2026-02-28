'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getTags(): Promise<Tag[] | string> {
    return await getWrapper({
        path: 'monitoring/tags',
        service: 'beekeeper'
    })
}
