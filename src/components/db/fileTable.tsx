'use client'

import { Table } from 'uibee/components'

type FileRow = {
    _id: string
    date: string
    location: Array<'local' | 'remote'>
    size: string
    name: string
}

const columns = [
    { key: 'date' as const },
    {
        key: 'location' as const,
        render: (v: unknown) => {
            const locs = v as Array<'local' | 'remote'>
            return (
                <span className='flex items-center gap-2'>
                    {locs.includes('remote') && (
                        <span className='rounded bg-orange-500/20 px-2 py-0.5 text-orange-300'>Offsite</span>
                    )}
                    {locs.includes('local') && (
                        <span className='rounded bg-login-400/30 px-2 py-0.5 text-login-200'>Onsite</span>
                    )}
                    {locs.length === 0 && <span>Unknown</span>}
                </span>
            )
        },
    },
    { key: 'size' as const },
    { key: 'name' as const },
]

export default function BackupFileTable({ rows }: { rows: FileRow[] }) {
    return (
        <Table
            data={rows as unknown as Record<string, unknown>[]}
            idKey='_id'
            columns={columns}
            hidePagination
        />
    )
}
