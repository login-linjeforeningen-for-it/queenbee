import InternalInfo from '@components/internal/information'
import InternalStats from '@components/internal/statistics'
import getInternalDashboard from '@utils/api/beekeeper/dashboard/get'

export default async function Page() {
    const dashboard = await getInternalDashboard()

    return (
        <div className='grid gap-4'>
            <h1 className='text-lg font-semibold'>Internal Dashboard</h1>
            <InternalStats statistics={dashboard.statistics} />
            <InternalInfo information={dashboard.information} />
        </div>
    )
}
