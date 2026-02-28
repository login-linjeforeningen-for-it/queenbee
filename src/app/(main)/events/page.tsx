import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import HistoricalSwitch from '@components/inputs/historical'
import formatAlert from '@components/alert/formatAlert'
import { Button } from 'uibee/components'
import deleteEvent from '@utils/api/workerbee/events/deleteEvent'
import getEvents from '@utils/api/workerbee/events/getEvents'

const headers = [
    'id',
    'name_no',
    'name_en',
    'time_start',
    'updated_at'

]

async function deleteAction(id: string) {
    'use server'
    await deleteEvent(Number(id))
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

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-semibold text-lg'>Events</h1>
                    <HistoricalSwitch name='historical' label='Historical' />
                </div>
                <div className='flex items-center justify-between py-3 gap-2'>
                    <Search />
                    <Button
                        text='New event'
                        icon='+'
                        path='events/create'
                    />
                </div>
            </div>
            { typeof events === 'string' || !Array.isArray(events.events) || events.events.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(events, 'No events found')}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={events.events}
                            headers={headers}
                            deleteAction={deleteAction}
                            redirectPath='/events/update'
                        />
                        <Pagination pageSize={limit} totalRows={events.total_count} />
                    </div>
                )
            }
        </div>
    )
}
