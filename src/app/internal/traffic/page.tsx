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
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row justify-between flex-none'>
                <h1 className='font-semibold text-lg text-login-50'>Traffic Metrics</h1>
            </div>
            <TrafficDashboard
                metrics={metrics}
                selectedDomain={selectedDomain}
                domainOptions={domainOptions}
            />
        </div>
    )
}
