import { ReactNode } from 'react'

export interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => ReactNode
    className?: string
    align?: 'left' | 'center' | 'right'
}

interface GeneralTableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyExtractor?: (item: T, index: number) => string | number
    noDataMessage?: string
}

export default function GeneralTable<T>({
    data,
    columns,
    keyExtractor,
    noDataMessage = 'No data found'
}: GeneralTableProps<T>) {
    return (
        <div className='bg-login-50/5 rounded-lg shadow overflow-hidden border border-login-600'>
            <table className='min-w-full divide-y divide-login-600'>
                <thead className='bg-login-700'>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-xs font-medium text-login-200 uppercase tracking-wider ${
                                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                                } ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='bg-login-50/5 divide-y divide-login-600'>
                    {data.length > 0 ? (
                        data.map((item,  index) => (
                            <tr key={keyExtractor ? keyExtractor(item, index) : index}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            column.align === 'right' ?
                                                'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                    >
                                        {column.cell
                                            ? column.cell(item)
                                            : column.accessorKey
                                                ? (item[column.accessorKey] as ReactNode)
                                                : null
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className='px-6 py-4 text-center text-sm text-login-200'
                            >
                                {noDataMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
