import InternalStats from '@components/internal/internalStats'
import SystemStats from '@components/internal/systemStats'
import getInternalDashboard from '@utils/api/beekeeper/dashboard/get'
import { Alert } from 'uibee/components'

export default async function Page() {
    const dashboard = await getInternalDashboard()

    return (
        <div className='flex flex-col gap-8 pb-4'>
            <div className='flex flex-col gap-4'>
                <h1 className='font-semibold text-lg'>Overview</h1>
                {dashboard.error
                    ? <Alert>Could not load the internal dashboard. {dashboard.error}</Alert>
                    : <InternalStats statistics={dashboard.statistics} />}
            </div>
            {!dashboard.error && <SystemStats initialDashboard={dashboard} />}
        </div>
    )
}
