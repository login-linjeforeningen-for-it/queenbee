import Search from '@components/inputs/search'
import Table from '@components/table/table'
import getVulnerabilities, { type GetVulnerabilities } from '@utils/api/internal/vulnerabilities/get'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''

    const data = await getVulnerabilities()
    const query = (search).toString().toLowerCase()

    const list = getRows(data, query)

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Vulnerabilities</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex items-center gap-4 text-sm text-login-200'>
                        <span>Images: {data.imageCount}</span>
                        {data.scanStatus.finishedAt && (
                            <span>
                                Last scan:{' '}
                                {new Date(data.scanStatus.finishedAt).toLocaleString('nb-NO')}
                            </span>
                        )}
                        {data.scanStatus.isRunning && (
                            <span className='text-yellow-500 font-medium'>Scanning...</span>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex-1 overflow-hidden'>
                <Table
                    list={list}
                    headers={['image', 'total', 'vulnerability_breakdown', 'group_dependency_breakdown']}
                    hideMenu={true}
                />
            </div>
        </div>
    )
}

function getRows(data: GetVulnerabilities, query: string) {
    return data.images
        .filter((img) => img.image.toLowerCase().includes(query))
        .map((img) => ({
            image: img.image,
            total: img.totalVulnerabilities,
            vulnerability_breakdown: `${img.severity.critical}/${img.severity.high}/${img.severity.medium}/${img.severity.low}`,
            group_dependency_breakdown: img.groups
                .map((g) => {
                    const parts = g.source.split(':')
                    return `${parts[1] || parts[0]}: ${g.severity.critical}/${g.severity.high}/${g.severity.medium}/${g.severity.low}`
                })
                .join(', '),
            scanned: img.scannedAt,
            status: img.scanError ? 'Error' : 'OK'
        }))
}

