import { SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import deleteOrganization from '@utils/api/workerbee/organizations/deleteOrganization'
import getOrganizations from '@utils/api/workerbee/organizations/getOrganizations'
import { Button } from 'uibee/components'

const columns = [
    { key: 'id' },
    { key: 'name_en' },
    { key: 'name_no' },
    { key: 'updated_at' },
]

async function deleteAction(id: string) {
    'use server'
    await deleteOrganization(Number(id))
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const organizations = await getOrganizations({
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    const data = typeof organizations !== 'string' && Array.isArray(organizations.organizations) ? organizations.organizations : []
    const totalRows = typeof organizations !== 'string' && Array.isArray(organizations.organizations) ? organizations.total_count : 0

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Organizations</h1>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <Button
                        text='New organization'
                        icon='+'
                        path='organizations/create'
                    />
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columns}
                    deleteAction={deleteAction}
                    redirectPath='/organizations/update'
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
