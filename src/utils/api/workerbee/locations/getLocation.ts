'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getLocation(id: number): Promise<GetLocationProps | string> {
    return await getWrapper({
        path: `locations/${id}`,
        service: 'workerbee'
    })
}
