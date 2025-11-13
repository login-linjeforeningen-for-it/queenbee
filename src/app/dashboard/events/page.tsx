import { deleteEvent, getEvents } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import HistoricalSwitch from '@components/inputs/historical'

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
        <div
            className={
                'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                'overflow-hidden flex flex-col'
            }
        >
            <div className='flex-none'>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-semibold text-lg'>Events</h1>
                    <HistoricalSwitch name={'historical'} label={'Historical'} />
                </div>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-[1rem]'>
                        <Button
                            text='New event'
                            icon='+'
                            path='events/create'
                        />
                    </div>
                </div>
            </div>
            { typeof events === 'string' || !Array.isArray(events.events) || events.events.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {typeof events === 'string'
                                ? events
                                : 'No events found'}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={events.events}
                            headers={headers}
                            deleteAction={deleteAction}
                        />
                        <Pagination pageSize={limit} totalRows={events.total_count} />
                    </div>
                )
            }
        </div>
    )
}