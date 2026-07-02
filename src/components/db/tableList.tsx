'use client'

import { useMemo, useState } from 'react'
import { Table, type SortState } from 'uibee/components'
import formatBytes from '@utils/db/formatBytes'

export default function TableList({ database }: { database: DatabaseOverviewItem }) {
    const [sort, setSort] = useState<SortState>({ column: 'totalBytes', order: 'desc' })

    const rows = useMemo(() => {
        const { column, order } = sort
        const sorted = [...database.tables].sort((a, b) => {
            let av: string | number
            let bv: string | number
            if (column === 'table') {
                av = `${a.schema}.${a.name}`
                bv = `${b.schema}.${b.name}`
            } else if (column === 'rows') {
                av = a.estimatedRows
                bv = b.estimatedRows
            } else {
                av = a[column as 'tableBytes' | 'indexBytes' | 'totalBytes']
                bv = b[column as 'tableBytes' | 'indexBytes' | 'totalBytes']
            }
            if (av < bv) return order === 'asc' ? -1 : 1
            if (av > bv) return order === 'asc' ? 1 : -1
            return 0
        })

        return sorted.map(t => ({
            table: `${t.schema}.${t.name}`,
            rows: t.estimatedRows.toLocaleString('nb-NO'),
            tableBytes: formatBytes(t.tableBytes),
            indexBytes: formatBytes(t.indexBytes),
            totalBytes: formatBytes(t.totalBytes),
        }))
    }, [database.tables, sort])

    if (!database.tables.length) {
        return (
            <div className='rounded-lg border border-dashed border-white/8 p-3 text-xs text-login-300'>
                No user tables found in this database.
            </div>
        )
    }

    return (
        <Table
            data={rows}
            idKey='table'
            columns={[
                { key: 'table', label: 'Table', sortable: true, render: (v) => {
                    const full = v as string
                    const dot = full.lastIndexOf('.')
                    return <><span className='text-login-400'>{full.substring(0, dot)}.</span>{full.substring(dot + 1)}</>
                }},
                { key: 'rows', label: 'Rows', sortable: true },
                { key: 'tableBytes', label: 'Table data', sortable: true },
                { key: 'indexBytes', label: 'Indexes', sortable: true },
                { key: 'totalBytes', label: 'Total', sortable: true },
            ]}
            sort={sort}
            onSort={setSort}
            hidePagination
        />
    )
}
