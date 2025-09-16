// import Activity from '@components/dashboard/activity'
import TotalStats from '@components/dashboard/totalStats'
import getStatics from '@utils/stats/getStatistics'

export default async function Home() {
    const stats: DashboardTotalStats = await getStatics()
    /* const yearlyActivity = Array.from(
        { length: 365 },
        () =>
            Math.random() < 0.8
                ? Math.floor(Math.random() * 3)
                : Math.floor(Math.random() * 11)
    ) */

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Dashboard</h1>
            <TotalStats stats={stats} />
            {/* <div className='flex justify-center w-full pt-4'>
                <Activity stats={yearlyActivity} />
            </div> */}
        </div>
    )
}
