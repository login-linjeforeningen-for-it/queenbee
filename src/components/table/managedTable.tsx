'use client'

import { Table, MenuButton, ConfirmPopup, Alert, toast, type Column } from 'uibee/components'
import { usePathname, useRouter } from 'next/navigation'
import { BoxesIcon, Edit, X } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
    data: Record<string, unknown>[]
    columns: Column<Record<string, unknown>>[]
    totalRows?: number
    pageSize?: number
    idKey?: string
    deleteAction?: (id: string) => Promise<unknown>
    redirectPath?: string
    expandKey?: string
    rawKeys?: string[]
    onRowClick?: (id: string) => void
    hidePagination?: boolean
    error?: string
}

function languageLabel(key: string) {
    const match = key.match(/^(.+)_(no|en)$/)
    if (!match) return undefined
    const words = match[1].split('_').map(word => word[0].toUpperCase() + word.slice(1))
    return `${words.join(' ')} (${match[2].toUpperCase()})`
}

export default function ManagedTable({
    data, columns, totalRows, pageSize, idKey,
    deleteAction, redirectPath, expandKey, rawKeys,
    onRowClick, hidePagination, error,
}: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const [pendingDelete, setPendingDelete] = useState<string | null>(null)

    const processedColumns: Column<Record<string, unknown>>[] = columns.map(col => ({
        ...col,
        label: col.label ?? languageLabel(col.key),
        ...(rawKeys?.includes(col.key) && { render: (v: unknown) => v as React.ReactNode }),
    }))

    async function confirmDelete() {
        if (!deleteAction || !pendingDelete) return
        const id = pendingDelete
        setPendingDelete(null)
        // apiWrapper reports failures as 'Error: ...' strings
        const result = await deleteAction(id).catch((err: unknown) => `Error: ${err instanceof Error ? err.message : err}`)
        if (typeof result === 'string' && result.startsWith('Error')) {
            toast.error(result)
            return
        }
        toast.success('Deleted')
        router.refresh()
    }

    const menuItems = deleteAction
        ? (_: Record<string, unknown>, id: string) => (
            <>
                <MenuButton icon={<Edit />} text='Edit' onClick={() => router.push(`${pathname}/update/${id}`)} />
                <MenuButton icon={<BoxesIcon />} text='Duplicate' onClick={() => router.push(`${pathname}/create/${id}`)} />
                <MenuButton
                    icon={<X />} text='Delete'
                    onClick={() => setPendingDelete(id)}
                    className='text-red-400'
                />
            </>
        )
        : undefined

    return (
        <>
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
                emptyState={error ? <Alert>{error}</Alert> : undefined}
                className='flex-1 h-full'
            />
            <ConfirmPopup
                isOpen={pendingDelete !== null}
                header={`Delete #${pendingDelete}?`}
                description='This cannot be undone.'
                confirmText='Delete'
                variant='danger'
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    )
}
