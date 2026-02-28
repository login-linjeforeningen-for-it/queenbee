'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getStatisticsYearlyActivity(): Promise<GetStatisticsYearlyActivityProps | string> {
    return await getWrapper({
        path: 'stats/yearly',
        service: 'workerbee'
    })
}
