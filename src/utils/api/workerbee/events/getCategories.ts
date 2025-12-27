'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getCategories(): Promise<GetCategoriesProps | string> {
    const path = config.workerbee.events.categories
    return await getWrapper({ path, service: 'workerbee' })
}
