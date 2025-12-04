import TrafficDashboard from '@components/traffic/traffic'
import { getTrafficMetrics } from '@utils/api'

export default async function Page() {
    const metrics = await getTrafficMetrics()

    return <TrafficDashboard metrics={metrics} />
}
