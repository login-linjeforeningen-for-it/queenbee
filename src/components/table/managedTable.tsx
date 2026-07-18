'use client'

import { Table, MenuButton, type Column } from 'uibee/components'
import { usePathname, useRouter } from 'next/navigation'
import { BoxesIcon, Edit, X } from 'lucide-react'
import React from 'react'

type Props = {
    data: Record<string, unknown>[]
    columns: Column<Record<string, unknown>>[]
    totalRows?: number
    pageSize?: number
    idKey?: string
    deleteAction?: (id: string) => Promise<void>
    redirectPath?: string
    expandKey?: string
    rawKeys?: string[]
    onRowClick?: (id: string) => void
    hidePagination?: boolean
}

export default function ManagedTable({
    data, columns, totalRows, pageSize, idKey,
    deleteAction, redirectPath, expandKey, rawKeys,
    onRowClick, hidePagination,
}: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const processedColumns: Column<Record<string, unknown>>[] = columns.map(col =>
        rawKeys?.includes(col.key)
            ? { ...col, render: (v: unknown) => v as React.ReactNode }
            : col
    )

    const menuItems = deleteAction
        ? (_: Record<string, unknown>, id: string) => (
            <>
                <MenuButton icon={<Edit />} text='Edit' onClick={() => router.push(`${pathname}/update/${id}`)} />
                <MenuButton icon={<BoxesIcon />} text='Duplicate' onClick={() => router.push(`${pathname}/create/${id}`)} />
                <MenuButton
                    icon={<X />} text='Delete'
                    onClick={async () => { await deleteAction(id); router.refresh() }}
                    className='text-red-400'
                />
            </>
        )
        : undefined

    return (
        <Table
            data={data}
            columns={processedColumns}
            idKey={idKey}
            redirectPath={redirectPath}
            menuItems={menuItems}
            onRowClick={onRowClick ? (_row, id) => onRowClick(id) : undefined}
            totalRows={totalRows}
            pageSize={pageSize}
            urlState={Boolean(totalRows && pageSize)}
            renderExpandedRow={expandKey ? (row) => row[expandKey] as React.ReactNode : undefined}
            hidePagination={hidePagination}
            className='flex-1 h-full'
        />
    )
}
