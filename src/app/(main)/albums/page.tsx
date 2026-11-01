import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import getAlbums from '@utils/api/workerbee/albums/getAlbums'
import deleteAlbum from '@utils/api/workerbee/albums/deleteAlbum'

async function deleteAction(id: string) {
    'use server'
    return await deleteAlbum(Number(id))
}

const columns = [
    { key: 'id' },
    { key: 'name_no' },
    { key: 'year' },
    { key: 'created_at' },
]

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const albums = await getAlbums({
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    const { data, totalRows, error } = listResult(albums, 'albums')

    return (
        <ListPage
            title='Albums'
            createText='New album'
            createPath='albums/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                redirectPath='/albums/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
