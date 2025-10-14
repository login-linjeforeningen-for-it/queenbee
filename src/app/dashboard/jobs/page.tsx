import { deleteJob, getJobs } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'

const headers = [
    'id',
    'title_no',
    'title_en',
]

async function deleteAction(id: string) {
    'use server'
    await deleteJob(Number(id))
}

export default async function Page({ searchParams}: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 10
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const jobs = await getJobs({
        search,
        offset,
        limit,
        orderBy,
        sort
    })

    return (
        <div
            className={
                'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                'overflow-hidden flex flex-col'
            }
        >
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Jobs</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New job' icon='+' path='jobs/create' />
                    </div>
                </div>
            </div>
            { typeof jobs === 'string' || !Array.isArray(jobs.jobs) || jobs.jobs.length < 1
                ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Alert>
                            {typeof jobs === 'string'
                                ? jobs
                                : 'No jobs found'}
                        </Alert>
                    </div>
                ) : (
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <Table
                            list={jobs.jobs}
                            headers={headers}
                            deleteAction={deleteAction}
                        />
                        <Pagination pageSize={10} totalRows={jobs.total_count} />
                    </div>
                )
            }
        </div>
    )
}