import { useState } from 'react'
import { TimerReset } from 'lucide-react'
import { Card } from 'uibee/components'
import formatBytes from '@utils/db/formatBytes'
import formatDuration from '@utils/db/formatDuration'
import ExpandButton from '@components/db/expandButton'
import QueryWindowGrid from '@components/db/queryWindowGrid'
import TableList from '@components/db/tableList'

export default function DatabaseCard({
    clusterName,
    database,
}: {
    clusterName: string
    database: DatabaseOverviewItem
}) {
    const [expanded, setExpanded] = useState(false)
    const [detailsExpanded, setDetailsExpanded] = useState(false)

    return (
        <Card className='px-5 py-4'>
            <div className='flex items-center gap-3'>
                <div
                    role='button'
                    tabIndex={0}
                    onClick={() => setExpanded(prev => !prev)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setExpanded(prev => !prev)
                        }
                    }}
                    aria-expanded={expanded}
                    aria-label={expanded ? `Collapse ${database.name}` : `Expand ${database.name}`}
                    className='flex min-w-0 flex-1 cursor-pointer items-center gap-3'
                >
                    <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <h3 className='truncate text-base font-semibold text-login-50'>{database.name}</h3>
                            <span
                                className='rounded-full border border-login-500/30 bg-login-600 px-2 py-1
                                    text-[11px] font-semibold uppercase tracking-[0.14em] text-login-200'
                            >
                                {clusterName}
                            </span>
                        </div>
                        <div className='mt-2 flex flex-wrap gap-2 text-xs text-login-200'>
                            <span>{formatBytes(database.sizeBytes)} total</span>
                            <span>{database.tableCount} tables</span>
                            <span>{database.currentConnections} connections</span>
                            <span>{database.activeQueries} active queries</span>
                        </div>
                    </div>
                </div>
                <ExpandButton
                    expanded={expanded}
                    label={database.name}
                    onToggle={() => setExpanded(prev => !prev)}
                />
            </div>

            {expanded ? (
                <div className='mt-5 flex flex-col gap-5'>
                    <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                        <Card className='p-3'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-login-200'>
                                Largest table
                            </div>
                            <div className='mt-2 text-sm font-semibold text-login-100'>
                                {database.largestTable || 'No tables'}
                            </div>
                        </Card>
                        <Card className='p-3'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-login-200'>
                                Longest query
                            </div>
                            <div className='mt-2 text-sm font-semibold text-login-100'>
                                {formatDuration(database.longestQuerySeconds)}
                            </div>
                        </Card>
                        <Card className='p-3'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-login-200'>
                                Active queries
                            </div>
                            <div className='mt-2 text-sm font-semibold text-login-100'>
                                {database.activeQueries}
                            </div>
                        </Card>
                        <Card className='p-3'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-login-200'>
                                Open connections
                            </div>
                            <div className='mt-2 text-sm font-semibold text-login-100'>
                                {database.currentConnections}
                            </div>
                        </Card>
                    </div>

                    <div>
                        <div className='mb-3 flex items-center gap-2'>
                            <TimerReset className='h-4 w-4 text-cyan-400' />
                            <h4 className='text-sm font-semibold text-login-50'>Active query runtime</h4>
                        </div>
                        <QueryWindowGrid averageQuerySeconds={database.averageQuerySeconds} />
                    </div>

                    <Card className='p-4'>
                        <div className='flex items-center gap-3'>
                            <div className='min-w-0 flex-1'>
                                <h4 className='text-sm font-semibold text-login-50'>Table footprint</h4>
                                <p className='mt-1 text-sm text-login-200'>
                                    Expand to inspect every table by data size, index size, and estimated row count.
                                </p>
                            </div>
                            <ExpandButton
                                expanded={detailsExpanded}
                                label={`${database.name} table footprint`}
                                onToggle={() => setDetailsExpanded(prev => !prev)}
                            />
                        </div>
                        {detailsExpanded ? <div className='mt-4'><TableList database={database} /></div> : null}
                    </Card>
                </div>
            ) : null}
        </Card>
    )
}
