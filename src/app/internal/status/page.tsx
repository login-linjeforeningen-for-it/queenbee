import { getNotifications, getServices, getTags } from '@utils/api'
import PageClient from './pageClient'

export default async function Page() {
    const serverServices = await getServices()
    const serverNotifications = await getNotifications()
    const serverTags = await getTags()
    const services = Array.isArray(serverServices) ? serverServices : []
    const tags = Array.isArray(serverTags) ? serverTags : []
    const notifications = Array.isArray(serverNotifications) ? serverNotifications : []
    return <PageClient services={services} notifications={notifications} tags={tags} />
}
