'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import formatBytes from '@utils/db/formatBytes'

type SortKey = 'table' | 'rows' | 'tableBytes' | 'indexBytes' | 'totalBytes'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string }[] = [
    { key: 'table', label: 'Table' },
    { key: 'rows', label: 'Rows' },
    { key: 'tableBytes', label: 'Table data' },
    { key: 'indexBytes', label: 'Indexes' },
    { key: 'totalBytes', label: 'Total' },
]

export default function TableList({ database }: { database: DatabaseOverviewItem }) {
    const [sortKey, setSortKey] = useState<SortKey>('totalBytes')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    function handleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('desc')
        }
    }

    const sorted = useMemo(() => {
        return [...database.tables].sort((a, b) => {
            const av = sortKey === 'table' ? `${a.schema}.${a.name}` : sortKey === 'rows' ? a.estimatedRows : a[sortKey]
            const bv = sortKey === 'table' ? `${b.schema}.${b.name}` : sortKey === 'rows' ? b.estimatedRows : b[sortKey]
            if (av < bv) return sortDir === 'asc' ? -1 : 1
            if (av > bv) return sortDir === 'asc' ? 1 : -1
            return 0
        })
    }, [database.tables, sortKey, sortDir])

    if (!database.tables.length) {
        return (
            <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                No user tables found in this database.
            </div>
        )
    }

    return (
        <div className='overflow-x-auto rounded-lg border border-white/6'>
            <table className='min-w-full text-sm'>
                <thead>
                    <tr className='border-b border-white/6 bg-login-950/60'>
                        {COLUMNS.map(col => (
                            <th
                                key={col.key}
                                className='px-4 py-2.5 text-left'
                            >
                                <button
                                    type='button'
                                    onClick={() => handleSort(col.key)}
                                    className='flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-login-300 transition-colors hover:text-login-100'
                                >
                                    {col.label}
                                    {sortKey === col.key ? (
                                        sortDir === 'asc'
                                            ? <ChevronUp className='h-3 w-3' />
                                            : <ChevronDown className='h-3 w-3' />
                                    ) : (
                                        <ChevronUp className='h-3 w-3 opacity-20' />
                                    )}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='divide-y divide-white/4'>
                    {sorted.map(t => (
                        <tr key={`${t.schema}-${t.name}`} className='transition-colors hover:bg-login-50/3'>
                            <td className='px-4 py-2.5 font-medium text-login-100'>
                                <span className='text-login-400'>{t.schema}.</span>{t.name}
                            </td>
                            <td className='px-4 py-2.5 tabular-nums text-login-200'>
                                {t.estimatedRows.toLocaleString('nb-NO')}
                            </td>
                            <td className='px-4 py-2.5 tabular-nums text-login-200'>{formatBytes(t.tableBytes)}</td>
                            <td className='px-4 py-2.5 tabular-nums text-login-200'>{formatBytes(t.indexBytes)}</td>
                            <td className='px-4 py-2.5 tabular-nums text-login-200'>{formatBytes(t.totalBytes)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
