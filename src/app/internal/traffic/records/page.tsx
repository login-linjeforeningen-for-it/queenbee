import TrafficDashboard from '@components/traffic/traffic'
import DomainSelector from '@components/traffic/domainSelector'
import Pagination from '@components/table/pagination'
import getTrafficDomains from '@utils/api/beekeeper/traffic/domains'
import getTrafficRecords from '@utils/api/beekeeper/traffic/records'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams

    const selectedDomain = typeof params.domain === 'string' ? params.domain : undefined
    const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
    const limit = 13

    const [domains, records] = await Promise.all([
        getTrafficDomains(),
        getTrafficRecords({ limit, page, domain: selectedDomain }),
    ])

    const domainOptions = typeof domains === 'object' && 'domains' in domains ? domains.domains : []
    const totalCount = typeof records === 'object' && 'total' in records ? records.total : 0

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row justify-between flex-none'>
                <h1 className='font-semibold text-lg text-login-50'>Recent Traffic</h1>
            </div>
            <div className='flex-1'>
                <TrafficDashboard records={records} />
            </div>
            <div className='pt-4'>
                <Pagination pageSize={limit} totalRows={totalCount} />
            </div>
        </div>
    )
}
