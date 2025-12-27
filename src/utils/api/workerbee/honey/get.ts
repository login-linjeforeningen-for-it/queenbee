'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getHoney(id: number): Promise<GetHoneyProps | string> {
    const path = `${config.workerbee.honey.path}/${id}`
    return await getWrapper({ path })
}
