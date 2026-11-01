import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import deleteOrganization from '@utils/api/workerbee/organizations/deleteOrganization'
import getOrganizations from '@utils/api/workerbee/organizations/getOrganizations'

const columns = [
    { key: 'id' },
    { key: 'name_en' },
    { key: 'name_no' },
    { key: 'updated_at' },
]

async function deleteAction(id: string) {
    'use server'
    return await deleteOrganization(Number(id))
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

    const { data, totalRows, error } = listResult(organizations, 'organizations')

    return (
        <ListPage
            title='Organizations'
            createText='New organization'
            createPath='organizations/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                redirectPath='/organizations/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
