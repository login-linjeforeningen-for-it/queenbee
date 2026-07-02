import { SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import deleteRule from '@utils/api/workerbee/rules/deleteRule'
import getRules from '@utils/api/workerbee/rules/getRules'
import { Button } from 'uibee/components'

async function deleteAction(id: string) {
    'use server'
    await deleteRule(Number(id))
}

const columns = [
    { key: 'id' },
    { key: 'name_no' },
    { key: 'name_en' },
    { key: 'updated_at' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page) - 1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const rules = await getRules({
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    const data = typeof rules !== 'string' && Array.isArray(rules.rules) ? rules.rules : []
    const totalRows = typeof rules !== 'string' && Array.isArray(rules.rules) ? rules.total_count : 0

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Rules</h1>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <Button
                        text='New rule'
                        icon='+'
                        path='rules/create'
                    />
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columns}
                    deleteAction={deleteAction}
                    redirectPath='/rules/update'
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
