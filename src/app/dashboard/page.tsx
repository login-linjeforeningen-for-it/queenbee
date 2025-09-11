import DashboardStats from '@components/dashboard/totalStats'

export default async function Home() {
    // const statics = await getStatics()
    const stats: DashboardTotalStats = {
        events: 10,
        jobs: 10,
        announcements: 10,
        organizations: 10,
        locations: 10,
    }
    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] flex flex-col'>
            <h1 className='font-semibold text-lg'>Dashboard</h1>
            <DashboardStats stats={stats} />
        </div>
    )
}