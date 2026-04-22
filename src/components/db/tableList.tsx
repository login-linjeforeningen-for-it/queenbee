import formatBytes from '@utils/db/formatBytes'

export default function TableList({ database }: { database: DatabaseOverviewItem }) {
    if (!database.tables.length) {
        return (
            <div className='rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-muted-foreground'>
                No user tables were found in this database.
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-3'>
            {database.tables.map((table) => (
                <div
                    key={`${database.name}-${table.schema}-${table.name}`}
                    className={`
                        grid gap-3 rounded-xl border border-white/5 bg-black/20 p-4
                        md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]
                    `}
                >
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold text-white'>{table.schema}.{table.name}</div>
                        <div className='mt-1 text-xs text-muted-foreground'>
                            Approx. {table.estimatedRows.toLocaleString('nb-NO')} rows
                        </div>
                    </div>
                    <div>
                        <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                            Table data
                        </div>
                        <div className='mt-1 text-sm font-semibold text-login-100'>{formatBytes(table.tableBytes)}</div>
                    </div>
                    <div>
                        <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                            Indexes
                        </div>
                        <div className='mt-1 text-sm font-semibold text-login-100'>{formatBytes(table.indexBytes)}</div>
                    </div>
                    <div>
                        <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                            Total
                        </div>
                        <div className='mt-1 text-sm font-semibold text-login-100'>{formatBytes(table.totalBytes)}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
