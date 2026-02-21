'use server'

import worstAndBestServiceStatus from '@components/services/worstAndBestServiceStatus'
import { ServiceStatus } from '@utils/interfaces'

export default async function getServiceMeta(): Promise<ServiceStatus> {
    const { meta } = await worstAndBestServiceStatus('prod', true)
    return meta
}
