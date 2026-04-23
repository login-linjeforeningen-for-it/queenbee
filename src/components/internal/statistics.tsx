import Stat from '@components/dashboard/stat'
import { Activity, AlertCircle, Database, Scale, Waypoints } from 'lucide-react'

type InternalStatsProps = {
    statistics: InternalDashboardStatistics
}

export default function InternalStats({ statistics }: InternalStatsProps) {
    return (
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-4'>
            <Stat text='alerts' link='internal/alerts' count={statistics.alerts} item={<AlertCircle className='w-5 h-5' />} />
            <Stat text='databases' link='internal/db' count={statistics.backups} item={<Database className='w-5 h-5' />} />
            <Stat text='sites' link='internal/loadbalancing' count={statistics.sites} item={<Scale className='w-5 h-5' />} />
            <Stat text='monitored sites' link='internal/monitoring' count={statistics.monitored} item={<Activity className='w-5 h-5' />} />
            <Stat text='requests today' link='internal/traffic' count={statistics.requestsToday} item={<Waypoints className='w-5 h-5' />} />
        </div>
    )
}
