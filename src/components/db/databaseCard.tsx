'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Table2 } from 'lucide-react'
import { Button } from 'uibee/components'
import formatBytes from '@utils/db/formatBytes'
import formatDuration from '@utils/db/formatDuration'
import TableList from '@components/db/tableList'

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-login-300'>{label}</div>
            <div className='text-sm font-semibold text-login-50'>{value}</div>
        </div>
    )
}

export default function DatabaseCard({ database }: { database: DatabaseOverviewItem }) {
    const [expanded, setExpanded] = useState(false)
    const [showTables, setShowTables] = useState(false)

    function toggle() { setExpanded(prev => !prev) }

    return (
        <div>
            <div
                className='flex cursor-pointer select-none items-center gap-3 py-3'
                role='button'
                tabIndex={0}
                onClick={toggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
                }}
                aria-expanded={expanded}
                aria-label={expanded ? `Collapse ${database.name}` : `Expand ${database.name}`}
            >
                <div className='min-w-0 flex-1'>
                    <span className='text-sm font-medium text-login-100'>{database.name}</span>
                    <div className='mt-0.5 text-xs text-login-300'>
                        {formatBytes(database.sizeBytes)} &middot; {database.tableCount} tables &middot; {database.currentConnections} connections
                    </div>
                </div>
                <Button
                    variant='secondary'
                    icon={<ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {expanded && (
                <div className='flex flex-col gap-4 pb-4 pl-0.5'>
                    <div className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4'>
                        <Stat label='Storage' value={formatBytes(database.sizeBytes)} />
                        <Stat label='Tables' value={String(database.tableCount)} />
                        <Stat label='Connections' value={String(database.currentConnections)} />
                        <Stat label='Active queries' value={String(database.activeQueries)} />
                        <Stat label='Largest table' value={database.largestTable || '-'} />
                        <Stat label='Longest query' value={formatDuration(database.longestQuerySeconds)} />
                    </div>

                    {database.tableCount > 0 && (
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
                            {showTables && <div className='mt-2'><TableList database={database} /></div>}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
