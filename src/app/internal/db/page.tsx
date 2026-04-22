import getDatabaseOverview from '@utils/api/internal/db/get'
import PageClient from './pageClient'

export default async function Page() {
    const overview = await getDatabaseOverview()

    return <PageClient overview={overview} />
}
