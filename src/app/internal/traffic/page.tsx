import TrafficDashboard from '@components/traffic/traffic'
import { getTrafficDomains, getTrafficMetrics } from '@utils/api'
import DomainSelector from '@components/traffic/domainSelector'
import ViewToggle from '@components/traffic/viewToggle'

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
                <ViewToggle />
                <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
            </div>
            <TrafficDashboard metrics={metrics} selectedDomain={selectedDomain} />
        </div>
    )
}
