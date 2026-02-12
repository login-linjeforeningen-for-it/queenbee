import Alert from '@components/alert/alert'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import HistoricalSwitch from '@components/inputs/historical'
import formatAlert from '@components/alert/formatAlert'
import deleteJob from '@utils/api/workerbee/jobs/deleteJob'
import getJobs from '@utils/api/workerbee/jobs/getJobs'
import { Button } from 'uibee/components'

const headers = [
    'id',
    'title_no',
    'title_en',
    'time_publish',
    'updated_at'
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

    return (
        <div className='h-full overflow-hidden flex flex-col'>
            <div className='flex-none'>
                <div className='flex flex-row justify-between'>
                    <h1 className='font-semibold text-lg'>Jobs</h1>
                    <HistoricalSwitch name='historical' label='Historical' />
                </div>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <Button
                        text='New job'
                        icon='+'
                        path='jobs/create'
                    />
                </div>
            </div>
            {typeof jobs === 'string' || !Array.isArray(jobs.jobs) || jobs.jobs.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {formatAlert(jobs, 'No jobs found')}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={jobs.jobs}
                            headers={headers}
                            deleteAction={deleteAction}
                        />
                        <Pagination pageSize={limit} totalRows={jobs.total_count} />
                    </div>
                )
            }
        </div>
    )
}
