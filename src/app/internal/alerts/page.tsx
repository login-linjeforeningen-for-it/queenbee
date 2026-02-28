import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import formatAlert from '@components/alert/formatAlert'
import deleteAlert from '@utils/api/workerbee/alerts/deleteAlert'
import getAlerts from '@utils/api/workerbee/alerts/getAlerts'
import { Button } from 'uibee/components'

async function deleteAction(id: string) {
    'use server'
    await deleteAlert(Number(id))
}

const headers = [
    'id',
    'title_en',
    'service',
    'page'
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

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Alerts</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-4'>
                        <Button text='New alert' icon='+' path='alerts/create' />
                    </div>
                </div>
            </div>
            { typeof alerts === 'string' || !Array.isArray(alerts.alerts) || alerts.alerts.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(alerts, 'No alerts found')}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={alerts.alerts}
                            headers={headers}
                            deleteAction={deleteAction}
                        />
                        <Pagination pageSize={limit} totalRows={alerts.total_count} />
                    </div>
                )
            }
        </div>
    )
}
