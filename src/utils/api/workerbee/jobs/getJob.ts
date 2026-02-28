'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getJob(id: number): Promise<GetJobProps | string> {
    return await getWrapper({
        path: `jobs/protected/${id}`,
        service: 'workerbee'
    })
}
