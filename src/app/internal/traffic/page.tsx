import TrafficDashboard from '@components/traffic/traffic'
import DomainSelector from '@components/traffic/domainSelector'
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
        <div>
            <div className='flex justify-between mb-4'>
                <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
            </div>
            <TrafficDashboard metrics={metrics} selectedDomain={selectedDomain} />
        </div>
    )
}
