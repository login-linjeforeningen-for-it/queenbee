import TrafficDashboard from '@components/traffic/traffic'
import { getTrafficMetrics, getTrafficRecords } from '@utils/api'

export default async function Page() {
    const metrics = await getTrafficMetrics()
    const records = await getTrafficRecords({ limit: 10 })

    console.log('Traffic metrics:', metrics)
    console.log('Traffic records:', records)

    return <TrafficDashboard metrics={metrics} records={records} />
}
