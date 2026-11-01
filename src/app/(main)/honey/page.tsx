import ListPage, { listResult } from '@components/table/listPage'
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
    return await deleteHoney(Number(id))
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

    const [honey, servicesResult] = await Promise.all([
        getHoneyList({
            search,
            offset: offset * limit,
            limit,
            orderBy,
            sort,
            service: activeType,
        }),
        getHoneyServices(),
    ])
    const services = Array.isArray(servicesResult)
        ? servicesResult
        : []

    const { data, totalRows, error } = listResult(honey, 'honeys')

    return (
        <ListPage
            title='Honey'
            toolbar={<HoneyTabs services={services} activeType={activeType} />}
            createText='New honey'
            createPath='honey/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                redirectPath='/honey/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
