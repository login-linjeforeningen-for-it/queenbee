import { SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import deleteAlert from '@utils/api/workerbee/alerts/deleteAlert'
import getAlerts from '@utils/api/workerbee/alerts/getAlerts'
import { Button } from 'uibee/components'

async function deleteAction(id: string) {
    'use server'
    await deleteAlert(Number(id))
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

    const data = typeof alerts !== 'string' && Array.isArray(alerts.alerts) ? alerts.alerts : []
    const totalRows = typeof alerts !== 'string' && Array.isArray(alerts.alerts) ? alerts.total_count : 0

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Alerts</h1>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <div className='flex flex-row gap-4'>
                        <Button text='New alert' icon='+' path='alerts/create' />
                    </div>
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columns}
                    deleteAction={deleteAction}
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
