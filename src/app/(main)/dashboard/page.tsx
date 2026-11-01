import { Alert } from 'uibee/components'
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
        getStatisticsNewAdditions({limit: 20}),
        getStatisticsYearlyActivity()
    ])

    let additions = additionsData

    if (Array.isArray(additions)) {
        additions = additions.map((addition) => ({...addition, updated_at: formatDate(addition.updated_at)}))
    }

    return (
        <div className='flex flex-col lg:h-full lg:overflow-hidden'>
            <h1 className='flex min-h-9 items-center font-semibold text-lg'>Dashboard</h1>
            <TotalStats stats={stats} />
            <div className='lg:flex flex-1 gap-4 overflow-hidden'>
                {typeof additions === 'string'
                    ? <Alert>Could not load recent additions. {additions}</Alert>
                    : additions && <StatisticsNewAdditions additions={additions} />}
                <div className='flex flex-col w-full max-w-4xl justify-between lg:h-full'>
                    {typeof categories === 'string'
                        ? <Alert>Could not load event categories. {categories}</Alert>
                        : categories && <StatisticsCategories categories={categories} />}
                    {typeof yearlyActivity === 'string'
                        ? <Alert>Could not load activity. {yearlyActivity}</Alert>
                        : yearlyActivity && <Activity stats={yearlyActivity} />}
                </div>
            </div>
        </div>
    )
}
