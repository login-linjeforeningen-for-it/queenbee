import { SearchInput } from 'uibee/components'
import ManagedTable from '@components/table/managedTable'
import HistoricalSwitch from '@components/inputs/historical'
import deleteJob from '@utils/api/workerbee/jobs/deleteJob'
import getJobs from '@utils/api/workerbee/jobs/getJobs'
import { Button } from 'uibee/components'

const columns = [
    { key: 'id' },
    { key: 'title_no' },
    { key: 'title_en' },
    { key: 'time_publish' },
    { key: 'updated_at' },
]

async function deleteAction(id: string) {
    'use server'
    await deleteJob(Number(id))
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

    const data = typeof jobs !== 'string' && Array.isArray(jobs.jobs) ? jobs.jobs : []
    const totalRows = typeof jobs !== 'string' && Array.isArray(jobs.jobs) ? jobs.total_count : 0

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-semibold text-lg'>Jobs</h1>
                    <HistoricalSwitch name='historical' label='Historical' />
                </div>
                <div className='flex items-center justify-between py-3'>
                    <SearchInput />
                    <Button
                        text='New job'
                        icon='+'
                        path='jobs/create'
                    />
                </div>
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ManagedTable
                    data={data as Record<string, unknown>[]}
                    columns={columns}
                    deleteAction={deleteAction}
                    redirectPath='/jobs/update'
                    totalRows={totalRows}
                    pageSize={limit}
                />
            </div>
        </div>
    )
}
