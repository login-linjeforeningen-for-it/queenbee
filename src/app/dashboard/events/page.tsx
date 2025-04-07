import { getEvents } from '@utils/api'
import ClientPage from './clientPage'
import Alert from '@components/alert/alert'

export default async function page() {
    const list = await getEvents()

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading events
            </Alert>
        </div>
    )

    const visible = ['id', 'name_no', 'name_en', 'category', 'location', 'time_type', 'start_time', 'end_time', 'publish_time', 'capacity', 'full', 'canceled', 'updated_at']
    return <ClientPage list={list} visible={visible} />
}
