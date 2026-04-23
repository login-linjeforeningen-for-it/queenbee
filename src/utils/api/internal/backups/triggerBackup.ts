'use server'

import { postWrapper } from '@utils/apiWrapper'

type Response = { message: string }

export default async function triggerBackup(): Promise<Response | string> {
    return await postWrapper({
        path: 'backup',
        data: {},
        service: 'beekeeper'
    })
}
