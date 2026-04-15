import getServices from '@utils/api/beekeeper/services/getServices'
import PageClient from './pageClient'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import getTags from '@utils/api/beekeeper/services/getTags'
import { cookies } from 'next/headers'

export default async function Page() {
    const serverServices = await getServices()
    const serverNotifications = await getNotifications()
    const serverTags = await getTags()
    const services = Array.isArray(serverServices) ? serverServices : []
    const tags = Array.isArray(serverTags) ? serverTags : []
    const notifications = Array.isArray(serverNotifications) ? serverNotifications : []
    const compressed = (await cookies()).get('monitoringCompressed')?.value !== 'false'
    return (
        <PageClient
            services={services}
            notifications={notifications}
            tags={tags}
            compressed={compressed}
        />
    )
}
