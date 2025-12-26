'use server'

import config from '@config'
import { authentikApiWrapper } from '@utils/apiAuthentik'

export default async function getApplicationMetrics() {
    return await authentikApiWrapper({
        path: '/core/applications/queenbee/metrics/',
        token: config.authentik.token || ''
    })
}
