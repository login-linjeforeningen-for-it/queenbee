// import Activity from '@components/dashboard/activity'
import TotalStats from '@components/dashboard/totalStats'
import StatisticsCategories from '@components/dashboard/statisticsCategories'
import StatisticsNewAdditions from '@components/dashboard/statisticsNewAdditions'
import getStatics from '@utils/stats/getStatistics'
import { getStatisticsCategories, getStatisticsNewAdditions } from '@utils/api'

export default async function Home() {
    const stats: DashboardTotalStats = await getStatics()
    const categories = await getStatisticsCategories()
    const additions = await getStatisticsNewAdditions()

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Dashboard</h1>
            <TotalStats stats={stats} />
            <div className='flex h-full'>
                {typeof additions === 'object' && <StatisticsNewAdditions additions={additions} />}
                {typeof categories === 'object' && <StatisticsCategories categories={categories} />}
            </div>
            {/* <div className='flex justify-center w-full pt-4'>
                <Activity stats={yearlyActivity} />
            </div> */}
        </div>
    )
}
