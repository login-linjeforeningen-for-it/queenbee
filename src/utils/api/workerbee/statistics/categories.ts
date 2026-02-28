'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getStatisticsCategories(): Promise<GetStatisticsCategoriesProps | string> {
    return await getWrapper({
        path: 'stats/categories',
        service: 'workerbee'
    })
}
