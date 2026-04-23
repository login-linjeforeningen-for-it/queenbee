'use client'

import { useState } from 'react'
import { Clock3, Database, SearchCode } from 'lucide-react'
import formatBytes from '@utils/db/formatBytes'
import getStatusTone from '@utils/db/getStatusTone'
import ExpandButton from '@components/db/expandButton'
import QueryWindowGrid from '@components/db/queryWindowGrid'
import QueryCard from '@components/db/queryCard'
import DatabaseCard from '@components/db/databaseCard'

export default function ClusterCard({ cluster }: { cluster: DatabaseOverviewCluster }) {
    const [expanded, setExpanded] = useState(false)
    const databaseLabel = cluster.databaseCount === 1 ? 'database' : 'databases'

    return (
        <section className='w-full rounded-2xl border border-login-100/10 bg-login-900/55 p-5'>
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
                    aria-label={expanded ? `Collapse ${cluster.name}` : `Expand ${cluster.name}`}
                    className='flex min-w-0 flex-1 cursor-pointer items-center gap-4'
                >
                    <div className='rounded-xl bg-login-50/5 p-3'>
                        <Database className='h-5 w-5 text-login-200' />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <h2 className='truncate text-lg font-semibold text-white'>{cluster.name}</h2>
                            <span
                                className={`rounded-full border px-2 py-1 text-[11px] font-semibold
                                    uppercase tracking-[0.14em] ${getStatusTone(cluster.status)}`}
                            >
                                {cluster.status}
                            </span>
                        </div>
                        <div className='mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground'>
                            <span>{cluster.project || 'No compose project'}</span>
                            <span>{cluster.databaseCount} {databaseLabel}</span>
                            <span>{formatBytes(cluster.totalSizeBytes)}</span>
                            <span>{cluster.activeQueries} active queries</span>
                        </div>
                    </div>
                </div>
                <ExpandButton
                    expanded={expanded}
                    label={cluster.name}
                    onToggle={() => setExpanded(prev => !prev)}
                />
            </div>

            {expanded ? (
                <div className='mt-5 flex flex-col gap-5'>
                    {cluster.error ? (
                        <div className='rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200'>
                            {cluster.error}
                        </div>
                    ) : null}

                    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Current connections
                            </div>
                            <div className='mt-2 text-xl font-semibold text-white'>{cluster.currentConnections}</div>
                        </div>
                        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Active queries
                            </div>
                            <div className='mt-2 text-xl font-semibold text-white'>{cluster.activeQueries}</div>
                        </div>
                        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Databases
                            </div>
                            <div className='mt-2 text-xl font-semibold text-white'>{cluster.databaseCount}</div>
                        </div>
                        <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                            <div className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Storage footprint
                            </div>
                            <div className='mt-2 text-xl font-semibold text-white'>{formatBytes(cluster.totalSizeBytes)}</div>
                        </div>
                    </div>

                    <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                        <div className='mb-3 flex items-center gap-2'>
                            <SearchCode className='h-4 w-4 text-orange-400' />
                            <h3 className='text-sm font-semibold text-white'>Longest running query</h3>
                        </div>
                        <QueryCard query={cluster.longestQuery} />
                    </div>

                    <div className='rounded-xl border border-white/5 bg-login-50/5 p-4'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Clock3 className='h-4 w-4 text-cyan-400' />
                            <h3 className='text-sm font-semibold text-white'>Average active query runtime</h3>
                        </div>
                        <QueryWindowGrid averageQuerySeconds={cluster.averageQuerySeconds} />
                    </div>

                    <div className='flex flex-col gap-4'>
                        {cluster.databases.map((database) => (
                            <DatabaseCard
                                key={`${cluster.id}-${database.name}`}
                                clusterName={cluster.name}
                                database={database}
                            />
                        ))}
                    </div>
                </div>
            ) : null}
        </section>
    )
}
