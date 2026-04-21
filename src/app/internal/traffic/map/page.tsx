import LiveTrafficMapDashboard from '@components/traffic/liveMapDashboard'
import getTrafficMetrics from '@utils/api/beekeeper/traffic/metrics'
import getTrafficRecords from '@utils/api/beekeeper/traffic/records'

export default async function Page() {

    const [metrics, records] = await Promise.all([
        getTrafficMetrics(),
        getTrafficRecords({ limit: 12, page: 1 }),
    ])


    return (
        <div className='flex h-full flex-col gap-4'>
            <LiveTrafficMapDashboard
                initialMetrics={typeof metrics === 'object' ? metrics : null}
                initialRecords={typeof records === 'object' ? records.result : []}
            />
        </div>
    )
}
