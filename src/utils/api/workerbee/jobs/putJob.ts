'use server'

import { putWrapper } from '@utils/apiWrapper'

export default async function putJob(id: number, body: PutJobProps): Promise<PutJobProps | string> {
    return await putWrapper({
        path: `jobs/${id}`,
        data: body,
        service: 'workerbee'
    })
}
