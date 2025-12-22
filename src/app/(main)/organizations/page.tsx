import { deleteOrganization, getOrganizations } from '@utils/api'
import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import formatAlert from '@components/alert/formatAlert'
import { Button } from 'uibee/components'

const headers = [
    'id',
    'name_en',
    'name_no',
    'updated_at'
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

    return (
        <div
            className={`
                h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)]
                overflow-hidden flex flex-col
            `}
        >
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Organizations</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-4'>
                        <Button
                            text='New organization'
                            icon='+'
                            path='organizations/create'
                        />
                    </div>
                </div>
            </div>
            { typeof organizations === 'string' || !Array.isArray(organizations.organizations) || organizations.organizations.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(organizations, 'No organizations found')}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={organizations.organizations}
                            headers={headers}
                            deleteAction={deleteAction}
                        />
                        <Pagination pageSize={limit} totalRows={organizations.total_count} />
                    </div>
                )
            }
        </div>
    )
}