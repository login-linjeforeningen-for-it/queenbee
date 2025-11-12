import Activity from '@components/dashboard/activity'
import TotalStats from '@components/dashboard/totalStats'
import StatisticsCategories from '@components/dashboard/statisticsCategories'
import StatisticsNewAdditions from '@components/dashboard/statisticsNewAdditions'
import getStatics from '@utils/stats/getStatistics'
import { getStatisticsCategories, getStatisticsNewAdditions, getStatisticsYearlyActivity } from '@utils/api'

export default async function Home() {
    const stats: DashboardTotalStats = await getStatics()
    const categories = await getStatisticsCategories()
    const additions = await getStatisticsNewAdditions()
    const yearlyActivity = await getStatisticsYearlyActivity()

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Dashboard</h1>
            <TotalStats stats={stats} />
            <div className='flex h-full gap-4'>
                {typeof additions !== 'object' || additions && <StatisticsNewAdditions additions={additions} />}
                <div className='flex flex-col w-full max-w-4xl justify-between'>
                    {typeof categories !== 'object' || categories && <StatisticsCategories categories={categories} />}
                    {typeof yearlyActivity !== 'object' || yearlyActivity && <Activity stats={yearlyActivity} />}
                </div>
            </div>
        </div>
    )
}
