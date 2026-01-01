import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Option from '@components/locationOption/serviceOption'
import Pagination from '@components/table/pagination'
import formatAlert from '@components/alert/formatAlert'
import deleteHoney from '@utils/api/workerbee/honey/deleteHoney'
import getHoneyList from '@utils/api/workerbee/honey/getList'
import getHoneyServices from '@utils/api/workerbee/honey/getServices'
import { Button } from 'uibee/components'

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

    const honey = await getHoneyList({
        search,
        offset: offset * limit,
        limit,
        orderBy,
        sort,
        service: activeType,
    })

    const servicesResult = await getHoneyServices()
    const services = Array.isArray(servicesResult)
        ? servicesResult
        : []

    return (
        <div className='h-full lg:max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Honey</h1>
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
                    <Button
                        text='New honey'
                        icon='+'
                        path='honey/create'
                    />
                </div>
            </div>
            {typeof honey === 'string' || !Array.isArray(honey.honeys) || honey.honeys.length < 1 ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>
                        {formatAlert(honey, 'No honey found')}
                    </Alert>
                </div>
            ) : (
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <Table
                        list={honey.honeys}
                        headers={headers}
                        deleteAction={deleteAction}
                    />
                    <Pagination pageSize={limit} totalRows={honey.total_count} />
                </div>
            )}
        </div>
    )
}
