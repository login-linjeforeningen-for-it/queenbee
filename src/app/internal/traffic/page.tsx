import TrafficDashboard from '@components/traffic/traffic'
import getTrafficDomains from '@utils/api/beekeeper/traffic/domains'
import getTrafficMetrics from '@utils/api/beekeeper/traffic/metrics'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams

    const selectedDomain = typeof params.domain === 'string' ? params.domain : undefined
    const [domains, metrics] = await Promise.all([
        getTrafficDomains(),
        getTrafficMetrics(selectedDomain ? { domain: selectedDomain } : {}),
    ])

    const domainOptions = typeof domains === 'object' && 'domains' in domains ? domains.domains : []

    return (
        <TrafficDashboard
            metrics={metrics}
            selectedDomain={selectedDomain}
            domainOptions={domainOptions}
        />
    )
}
