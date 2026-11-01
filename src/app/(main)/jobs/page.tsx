import ListPage, { listResult } from '@components/table/listPage'
import ManagedTable from '@components/table/managedTable'
import HistoricalSwitch from '@components/inputs/historical'
import deleteJob from '@utils/api/workerbee/jobs/deleteJob'
import getJobs from '@utils/api/workerbee/jobs/getJobs'

const columns = [
    { key: 'id' },
    { key: 'title_no' },
    { key: 'title_en' },
    { key: 'time_publish' },
    { key: 'updated_at' },
]

async function deleteAction(id: string) {
    'use server'
    return await deleteJob(Number(id))
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page) - 1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'
    const historical = filters.historical === 'true'

    const jobs = await getJobs({
        search,
        offset,
        limit,
        orderBy,
        sort,
        historical
    })

    const { data, totalRows, error } = listResult(jobs, 'jobs')

    return (
        <ListPage
            title='Jobs'
            aside={<HistoricalSwitch name='historical' label='Historical' />}
            createText='New job'
            createPath='jobs/create'
        >
            <ManagedTable
                error={error}
                data={data}
                columns={columns}
                deleteAction={deleteAction}
                redirectPath='/jobs/update'
                totalRows={totalRows}
                pageSize={limit}
            />
        </ListPage>
    )
}
