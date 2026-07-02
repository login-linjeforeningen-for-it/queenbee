import { Button, SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import deleteHoney from '@utils/api/workerbee/honey/deleteHoney'
import getHoneyList from '@utils/api/workerbee/honey/getList'
import getHoneyServices from '@utils/api/workerbee/honey/getServices'
import HoneyTabs from './tabs'

const columns = [
    { key: 'id' },
    { key: 'language' },
    { key: 'page' },
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

    const data = typeof honey !== 'string' && Array.isArray(honey.honeys) ? honey.honeys : []
    const totalRows = typeof honey !== 'string' && Array.isArray(honey.honeys) ? honey.total_count : 0

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Honey</h1>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <HoneyTabs services={services} activeType={activeType} />
                    <Button
                        text='New honey'
                        icon='+'
                        path='honey/create'
                    />
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columns}
                    deleteAction={deleteAction}
                    redirectPath='/honey/update'
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
