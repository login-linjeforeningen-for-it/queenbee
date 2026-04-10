import DomainSelector from '@components/traffic/domainSelector'
import LiveTrafficMapDashboard from '@components/traffic/liveMapDashboard'
import getTrafficDomains from '@utils/api/beekeeper/traffic/domains'
import getTrafficMetrics from '@utils/api/beekeeper/traffic/metrics'
import getTrafficRecords from '@utils/api/beekeeper/traffic/records'

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const selectedDomain = typeof params.domain === 'string' ? params.domain : undefined

    const [domains, metrics, records] = await Promise.all([
        getTrafficDomains(),
        getTrafficMetrics(selectedDomain ? { domain: selectedDomain } : {}),
        getTrafficRecords({ limit: 12, page: 1, domain: selectedDomain }),
    ])

    const domainOptions = typeof domains === 'object' && 'domains' in domains ? domains.domains : []

    return (
        <div className='flex h-full flex-col gap-4'>
            <div className='flex justify-between'>
                <DomainSelector domains={domainOptions} selectedDomain={selectedDomain} />
            </div>
            <LiveTrafficMapDashboard
                initialMetrics={typeof metrics === 'object' ? metrics : null}
                initialRecords={typeof records === 'object' ? records.result : []}
            />
        </div>
    )
}
