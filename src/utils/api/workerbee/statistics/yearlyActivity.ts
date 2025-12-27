'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getStatisticsYearlyActivity(): Promise<GetStatisticsYearlyActivityProps | string> {
    const path = `${config.workerbee.statistics.path}/yearly`
    return await getWrapper({ path })
}
