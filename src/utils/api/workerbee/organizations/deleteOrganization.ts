'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteOrganization(id: number) {
    return await deleteWrapper({
        path: `organizations/${id}`,
        service: 'workerbee'
    })
}
