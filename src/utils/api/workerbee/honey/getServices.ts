'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getHoneyServices(): Promise<string[] | string> {
    return await getWrapper({
        path: 'text',
        service: 'workerbee'
    })
}
