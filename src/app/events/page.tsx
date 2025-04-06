import { getEvents } from '@utils/api'
import ClientPage from './clientPage'

export default async function page() {
    const list = await getEvents()
    const visible = ['id', 'name_no', 'name_en', 'category', 'location', 'time_type', 'start_time', 'end_time', 'publish_time', 'capacity', 'full', 'canceled', 'updated_at']
    return <ClientPage list={list} visible={visible} />
}
