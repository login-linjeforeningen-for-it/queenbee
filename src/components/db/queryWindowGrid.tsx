import WindowStat from '@components/db/windowStat'

export default function QueryWindowGrid({ averageQuerySeconds }: { averageQuerySeconds: DatabaseOverviewAverageQuery }) {
    return (
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
            <WindowStat label='1 minute' value={averageQuerySeconds.lastMinute} />
            <WindowStat label='5 minutes' value={averageQuerySeconds.lastFiveMinutes} />
            <WindowStat label='1 hour' value={averageQuerySeconds.lastHour} />
            <WindowStat label='1 day' value={averageQuerySeconds.lastDay} />
        </div>
    )
}
