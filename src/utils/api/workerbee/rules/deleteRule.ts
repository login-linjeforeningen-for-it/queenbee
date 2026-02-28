'use server'

import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteRule(id: number) {
    return await deleteWrapper({
        path: `rules/${id}`,
        service: 'workerbee'
    })
}
