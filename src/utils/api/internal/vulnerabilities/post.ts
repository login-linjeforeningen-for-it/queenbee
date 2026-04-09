'use server'

import { postWrapper } from '@utils/apiWrapper'
import type { DockerScoutScanStatus } from './get'

type TriggerVulnerabilityScanResponse = {
    message: string
    status: DockerScoutScanStatus
}

export default async function triggerVulnerabilityScan(): Promise<TriggerVulnerabilityScanResponse | string> {
    return await postWrapper({
        path: 'vulnerabilities/scan',
        data: {},
        service: 'internal'
    })
}
