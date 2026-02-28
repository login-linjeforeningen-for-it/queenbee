'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getTrafficMetrics(
    { start, end, domain }: { start?: string, end?: string, domain?: string } = {}): Promise<TrafficMetricsProps | string> {
    const queryParts = new URLSearchParams()
    if (start) {
        queryParts.append('start', start)
    }

    if (end) {
        queryParts.append('end', end)
    }

    if (domain) {
        queryParts.append('domain', domain)
    }

    return await getWrapper({
        path: `traffic/metrics?${queryParts.toString()}`,
        service: 'beekeeper'
    })
}
