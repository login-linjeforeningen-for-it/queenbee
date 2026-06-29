import formatDuration from '@utils/db/formatDuration'

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-login-300'>{label}</div>
            <div className='text-sm font-semibold text-login-50'>{value}</div>
        </div>
    )
}

export default function QueryCard({ query }: { query: DatabaseOverviewQuery | null }) {
    if (!query) {
        return (
            <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                No active query details available.
            </div>
        )
    }

    return (
        <div className='rounded-lg border border-white/6 bg-login-950/40 p-4'>
            <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4'>
                <Stat label='Database' value={query.database} />
                <Stat label='Duration' value={formatDuration(query.ageSeconds)} />
                <Stat label='User' value={query.user || 'Unknown'} />
                <Stat label='Wait state' value={query.waitEventType || 'Running'} />
            </div>
            <div className='mt-4 max-h-36 max-w-full overflow-x-auto overflow-y-auto rounded-lg border border-white/5 bg-login-950/60'>
                <pre className='min-w-full w-max p-3 font-mono text-xs leading-5 text-login-200 whitespace-pre'>
                    {query.query}
                </pre>
            </div>
        </div>
    )
}
