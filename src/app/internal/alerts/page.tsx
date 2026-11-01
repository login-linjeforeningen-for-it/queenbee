import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import deleteAlert from '@utils/api/workerbee/alerts/deleteAlert'
import getAlerts from '@utils/api/workerbee/alerts/getAlerts'

async function deleteAction(id: string) {
    'use server'
    return await deleteAlert(Number(id))
}

const columns = [
    { key: 'id' },
    { key: 'title_en' },
    { key: 'service' },
    { key: 'page' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const alerts = await getAlerts({
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    const { data, totalRows, error } = listResult(alerts, 'alerts')

    return (
        <ListPage
            title='Alerts'
            createText='New alert'
            createPath='alerts/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
