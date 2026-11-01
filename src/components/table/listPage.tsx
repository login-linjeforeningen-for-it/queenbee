import type { ReactNode } from 'react'
import { Button, SearchInput } from 'uibee/components'

type ListPageProps = {
    title: ReactNode
    aside?: ReactNode
    toolbar?: ReactNode
    createText?: string
    createPath?: string
    children: ReactNode
}

export default function ListPage({ title, aside, toolbar, createText, createPath, children }: ListPageProps) {
    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none flex flex-col gap-3 pb-4'>
                <div className='flex min-h-9 items-center justify-between gap-2'>
                    <h1 className='font-semibold text-lg'>{title}</h1>
                    {aside && <div>{aside}</div>}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <SearchInput />
                    {toolbar}
                    {createPath && <Button text={createText} icon='+' path={createPath} className='ml-auto h-10' />}
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                {children}
            </div>
        </div>
    )
}

export function listResult<K extends string>(result: string | ({ [P in K]: unknown } & { total_count?: number }), key: K) {
    if (typeof result === 'string') return { data: [], totalRows: 0, error: result }
    const rows = result[key]
    return Array.isArray(rows)
        ? { data: rows as Record<string, unknown>[], totalRows: Number(result.total_count) || 0, error: undefined }
        : { data: [], totalRows: 0, error: undefined }
}
