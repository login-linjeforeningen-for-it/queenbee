import DashboardStats from '@components/dashboard/totalStats'
import getStatics from '@utils/stats/getStatistics'

export default async function Home() {
    const stats: DashboardTotalStats = await getStatics()
    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Dashboard</h1>
            <DashboardStats stats={stats} />
        </div>
    )
}
