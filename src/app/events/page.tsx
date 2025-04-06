import List from '@components/list/list'
import { getEvents } from '@utils/api'

export default async function page() {
    const events = await getEvents()
    const visible = ['id', 'name_no', 'name_en', 'category', 'location', 'time_type', 'start_time', 'end_time', 'publish_time', 'capacity', 'full', 'canceled', 'updated_at']
    return (
        <div className='w-full h-full'>
            <h1 className='font-semibold text-lg'>Events</h1>
            <div className='flex justify-between h-[6vh]'>
                <h1>Filter (for text only)</h1>
                <h1>Create new button</h1>
            </div>
            <List sticky={['id']} list={list} visible={visible}/>
        </div>
    )
}
