import getServices from '@utils/api/beekeeper/services/getServices'
import getNotifications from '@utils/api/beekeeper/services/getNotifications'
import getTags from '@utils/api/beekeeper/services/getTags'
import PageClient from './pageClient'

export default async function Page() {
    const [serverServices, serverNotifications, serverTags] = await Promise.all([
        getServices(),
        getNotifications(),
        getTags(),
    ])
    const services = Array.isArray(serverServices) ? serverServices : []
    const notifications = Array.isArray(serverNotifications) ? serverNotifications : []
    const tags = Array.isArray(serverTags) ? serverTags : []
    return (
        <PageClient
            services={services}
            notifications={notifications}
            tags={tags}
        />
    )
}
