'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getHoney(id: number): Promise<GetHoneyProps | string> {
    return await getWrapper({
        path: `honeys/${id}`,
        service: 'workerbee'
    })
}
