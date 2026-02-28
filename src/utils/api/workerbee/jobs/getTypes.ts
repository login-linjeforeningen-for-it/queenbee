'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getTypes(): Promise<GetJobTypesProps | string> {
    return await getWrapper({
        path: 'jobs/types/all',
        service: 'workerbee'
    })
}
