'use server'

import config from '@config'
import { deleteWrapper } from '@utils/apiWrapper'

export default async function deleteOrganization(id: number) {
    const path = `${config.workerbee.organizations.path}/${id}`
    return await deleteWrapper({ path, service: 'workerbee' })
}
