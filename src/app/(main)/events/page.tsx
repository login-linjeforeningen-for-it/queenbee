import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import HistoricalSwitch from '@components/inputs/historical'
import deleteEvent from '@utils/api/workerbee/events/deleteEvent'
import getEvents from '@utils/api/workerbee/events/getEvents'

const columns = [
    { key: 'id' },
    { key: 'name_no' },
    { key: 'name_en' },
    { key: 'time_start' },
    { key: 'updated_at' },
]

async function deleteAction(id: string) {
    'use server'
    return await deleteEvent(Number(id))
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
    const historical = filters.historical === 'true'

    const events = await getEvents({
        search,
        offset,
        limit,
        orderBy,
        sort,
        historical
    })

    const { data, totalRows, error } = listResult(events, 'events')

    return (
        <ListPage
            title='Events'
            aside={<HistoricalSwitch name='historical' label='Historical' />}
            createText='New event'
            createPath='events/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                redirectPath='/events/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
