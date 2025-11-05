import { deleteHoney, getHoneys, getHoneyServices } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Option from '@components/locationOption/serviceOption'
import Pagination from '@components/table/pagination'

const headers = [
    'id',
    'language',
    'page'
]

async function deleteAction(id: string) {
    'use server'
    await deleteHoney(Number(id))
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'
    const activeType = filters.type ?? 'beehive'

    const honeys = await getHoneys({
        search,
        offset: offset * limit,
        limit,
        orderBy,
        sort,
        service: activeType,
    })

    console.log('honeys', honeys)

    const servicesResult = await getHoneyServices()
    const services = Array.isArray(servicesResult)
        ? servicesResult
        : []

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Honeys</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex gap-4'>
                        {services.map(service => (
                            <Option
                                key={service}
                                value={service}
                                active={activeType}
                            />
                        ))}
                    </div>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button
                            text='New honey'
                            icon='+'
                            path='honeys/create'
                        />
                    </div>
                </div>
            </div>
            {typeof honeys === 'string' || !Array.isArray(honeys.honeys) || honeys.honeys.length < 1 ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>
                        {typeof honeys === 'string'
                            ? honeys
                            : 'No honeys found'}
                    </Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <Table
                        list={honeys.honeys}
                        headers={headers}
                        deleteAction={deleteAction}
                    />
                    <Pagination pageSize={limit} totalRows={honeys.total_count} />
                </div>
            )}
        </div>
    )
}
