import InternalStats from '@components/internal/statistics'
import SystemStats from '@components/internal/systemStats'
import getInternalDashboard from '@utils/api/beekeeper/dashboard/get'
import getStats from '@utils/api/internal/system/getStats'
import getDocker from '@utils/api/internal/system/getDocker'

export default async function Page() {
    const dashboard = await getInternalDashboard()
    const metrics = await getStats()
    const docker = await getDocker()


    return (
        <div className='flex flex-col gap-8 pb-4'>
            <div className='flex flex-col gap-4'>
                <h1 className='text-xl font-semibold'>Overview</h1>
                <InternalStats statistics={dashboard.statistics} />
            </div>
            <SystemStats initialMetrics={metrics} initialDocker={docker} information={dashboard.information} />
        </div>
    )
}
