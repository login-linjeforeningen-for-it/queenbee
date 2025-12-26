'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getStatisticsNewAdditions(): Promise<GetStatisticsNewAdditionsProps | string> {
    const path = `${config.workerbee.statistics.path}/new-additions`
    return await getWrapper({ path })
}
