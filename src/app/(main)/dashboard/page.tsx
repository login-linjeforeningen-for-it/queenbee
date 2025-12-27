import Activity from '@components/dashboard/activity'
import TotalStats from '@components/dashboard/totalStats'
import StatisticsCategories from '@components/dashboard/statisticsCategories'
import StatisticsNewAdditions from '@components/dashboard/statisticsNewAdditions'
import getStatics from '@utils/stats/getStatistics'
import formatDate from '@utils/date/formatDate'
import getStatisticsCategories from '@utils/api/workerbee/statistics/categories'
import getStatisticsNewAdditions from '@utils/api/workerbee/statistics/newAdditions'
import getStatisticsYearlyActivity from '@utils/api/workerbee/statistics/yearlyActivity'

export default async function Home() {
    const [stats, categories, additionsData, yearlyActivity] = await Promise.all([
        getStatics(),
        getStatisticsCategories(),
        getStatisticsNewAdditions(),
        getStatisticsYearlyActivity(),
    ])

    let additions = additionsData

    if (Array.isArray(additions)) {
        additions = additions.map((addition) => ({...addition, updated_at: formatDate(addition.updated_at)}))
    }

    // const data = await getApplicationMetrics()

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
