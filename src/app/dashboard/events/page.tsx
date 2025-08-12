import { getEvents } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
import Table from '@components/table/table'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    // const filters = await searchParams
    // const search = typeof filters.q === 'string' ? filters.q : ''
    // const page = typeof filters.page === 'string' ? Number(filters.page) : 0
    // const offset = typeof filters.offset === 'string' ? Number(filters.offset) : 0
    
    const list = await getEvents()

    if ( typeof list === 'string' || list.length <= 0 ) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    {typeof list === 'string' ? list : 'No events found'}
                </Alert>
            </div>
        )
    }

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Events</h1>
                <div className='flex justify-between pb-4'>
                    <Filter/>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New event' icon='+' path='events/0' />
                    </div>
                </div>
            </div>
            <Table list={list} headers={['id', 'name_no', 'name_en', 'category', 'location', 'time_type', 'start_time', 'end_time', 'publish_time', 'capacity', 'full', 'canceled', 'updated_at']} />
        </div>
    )
}