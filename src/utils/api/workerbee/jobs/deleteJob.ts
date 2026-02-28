'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteJob(id: number) {
    return await deleteWrapper({
        path: `jobs/${id}`,
        service: 'workerbee'
    })
}
