'use client'

import { useState } from 'react'
import { ChevronRight, Database, SearchCode, Table2 } from 'lucide-react'
import { PulseDot } from 'uibee/components'
import formatBytes from '@utils/db/formatBytes'
import formatDuration from '@utils/db/formatDuration'
import QueryCard from '@components/db/queryCard'
import DatabaseCard from '@components/db/databaseCard'
import TableList from '@components/db/tableList'
import ExpandableCard from '@components/shared/expandableCard'

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-login-300'>{label}</div>
            <div className='text-sm font-semibold text-login-50'>{value}</div>
        </div>
    )
}

export default function ClusterCard({ cluster }: { cluster: DatabaseOverviewCluster }) {
    const [expanded, setExpanded] = useState(false)
    const [showTables, setShowTables] = useState(false)

    const solo = cluster.databases.length === 1 ? cluster.databases[0] : null

    const subtitle = `${cluster.project || 'No project'} · ${cluster.databaseCount} ${cluster.databaseCount === 1 ? 'database' : 'databases'} · ${formatBytes(cluster.totalSizeBytes)}`

    return (
        <ExpandableCard
            icon={Database}
            iconTone='orange'
            title={cluster.name}
            subtitle={subtitle}
            pulse={{
                variant: cluster.status.toLowerCase().includes('up') ? 'online' : 'offline',
                label: cluster.status,
            }}
            isExpanded={expanded}
            onToggle={() => setExpanded(prev => !prev)}
        >
            <div className='flex flex-col gap-6'>
                {cluster.error && (
                    <div className='rounded-lg border border-red-500/20 bg-red-500/8 p-3 text-sm text-red-300'>
                        {cluster.error}
                    </div>
                )}

                {solo ? (
                    <>
                        <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4'>
                            <Stat label='Database' value={solo.name} />
                            <Stat label='Storage' value={formatBytes(solo.sizeBytes)} />
                            <Stat label='Tables' value={String(solo.tableCount)} />
                            <Stat label='Connections' value={String(solo.currentConnections)} />
                            <Stat label='Active queries' value={String(solo.activeQueries)} />
                            <Stat label='Largest table' value={solo.largestTable || '—'} />
                            <Stat label='Longest query' value={formatDuration(solo.longestQuerySeconds)} />
                        </div>

                        {cluster.longestQuery && (
                            <div>
                                <div className='mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-login-300'>
                                    <SearchCode className='h-3.5 w-3.5' />
                                    Longest running query
                                </div>
                                <QueryCard query={cluster.longestQuery} />
                            </div>
                        )}

                        {solo.tableCount > 0 && (
                            <div>
                                <button
                                    type='button'
                                    onClick={() => setShowTables(prev => !prev)}
                                    className='flex w-full items-center gap-3 rounded-md bg-login-500 px-3 py-2 text-sm font-medium text-login-50 transition-all duration-150 hover:bg-login-400'
                                >
                                    <Table2 className='h-4 w-4 shrink-0 text-login-200' />
                                    <span className='flex-1 text-left'>Table breakdown</span>
                                    <ChevronRight className={`h-4 w-4 shrink-0 text-login-200 transition-transform duration-150 ${showTables ? 'rotate-90' : ''}`} />
                                </button>
                                {showTables && <div className='mt-2'><TableList database={solo} /></div>}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4'>
                            <Stat label='Connections' value={String(cluster.currentConnections)} />
                            <Stat label='Active queries' value={String(cluster.activeQueries)} />
                            <Stat label='Databases' value={String(cluster.databaseCount)} />
                            <Stat label='Storage' value={formatBytes(cluster.totalSizeBytes)} />
                        </div>

                        {cluster.longestQuery && (
                            <div>
                                <div className='mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-login-300'>
                                    <SearchCode className='h-3.5 w-3.5' />
                                    Longest running query
                                </div>
                                <QueryCard query={cluster.longestQuery} />
                            </div>
                        )}

                        <div className='flex flex-col divide-y divide-white/5'>
                            {cluster.databases.map((database) => (
                                <DatabaseCard
                                    key={`${cluster.id}-${database.name}`}
                                    database={database}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </ExpandableCard>
    )
}
