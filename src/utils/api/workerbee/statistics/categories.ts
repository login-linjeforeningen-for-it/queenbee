'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getStatisticsCategories(): Promise<GetStatisticsCategoriesProps | string> {
    const path = `${config.workerbee.statistics.path}/categories`
    return await getWrapper({ path, service: 'workerbee' })
}
