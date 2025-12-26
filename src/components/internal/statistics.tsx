import Stat from '@components/dashboard/stat'
import { Activity, AlertCircle, Database, Scale, Server, Waypoints } from 'lucide-react'

type InternalStatsProps = {
    statistics: InternalDashboardStatistics
}

export default function InternalStats({ statistics }: InternalStatsProps) {
    return (
        <div className='grid grid-cols-2 md:grid-cols-7 gap-4'>
            <Stat text='alerts' count={statistics.alerts} item={<AlertCircle className='w-5 h-5' />} />
            <Stat text='databases' link='backups' count={statistics.backups} item={<Database className='w-5 h-5' />} />
            <Stat text='sites' count={statistics.sites} item={<Scale className='w-5 h-5' />} />
            <Stat text='namespaces' link='kubernetes' count={statistics.kubernetes} item={<Server className='w-5 h-5' />} />
            <Stat text='status' count={statistics.monitored} item={<Activity className='w-5 h-5' />} />
            <Stat text='requests today' link='traffic' count={statistics.requestsToday} item={<Waypoints className='w-5 h-5' />} />
        </div>
    )
}
