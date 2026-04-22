import formatDuration from '@utils/db/formatDuration'

export default function QueryCard({ query }: { query: DatabaseOverviewQuery | null }) {
    if (!query) {
        return (
            <div className='rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-muted-foreground'>
                No active query details are available right now.
            </div>
        )
    }

    return (
        <div className='rounded-xl border border-white/5 bg-black/20 p-4'>
            <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                <div>
                    <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                        Database
                    </div>
                    <div className='mt-1 text-sm font-semibold text-login-100'>{query.database}</div>
                </div>
                <div>
                    <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                        Duration
                    </div>
                    <div className='mt-1 text-sm font-semibold text-login-100'>{formatDuration(query.ageSeconds)}</div>
                </div>
                <div>
                    <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                        User
                    </div>
                    <div className='mt-1 text-sm font-semibold text-login-100'>{query.user || 'Unknown'}</div>
                </div>
                <div>
                    <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                        Wait state
                    </div>
                    <div className='mt-1 text-sm font-semibold text-login-100'>{query.waitEventType || 'Running'}</div>
                </div>
            </div>
            <div className='mt-4 max-h-80 overflow-auto rounded-lg border
                border-white/5 bg-login-950/60'
            >
                <pre
                    className='inline-block min-w-max p-3 font-mono text-xs
                        text-login-200 whitespace-pre'
                >
                    {query.query}
                </pre>
            </div>
        </div>
    )
}
