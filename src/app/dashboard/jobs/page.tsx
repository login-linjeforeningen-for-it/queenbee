import { getJobs } from '@utils/api'
import Alert from '@components/alert/alert'
import FilterList from '@components/filterList/filterList'
import List from '@components/list/list'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const filterText = typeof filters.q === 'string' ? filters.q : ''
    const pageNumber = typeof filters.p === 'string' ? Number(filters.p) : 0

    const limit = 200
    const listLimit = 10
    const list = await getJobs(limit)

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading jobs
            </Alert>
        </div>
    )

    const filteredList = filterText !== '' ? FilterList({ list, filterText }).splice(0,listLimit) : list.splice(0,listLimit)
    const visible = ['id', 'name_no', 'title_no', 'job_type', 'time_publish', 'application_deadline', 'application_url', 'updated_at', 'visible']

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Jobs</h1>
                <div className='flex justify-between pb-4'>
                    <Filter/>
                    <Button text='New job' icon='+' path='jobs/0' />
                </div>
            </div>
            {filteredList.length > 0 && <List sticky={['id']} list={filteredList} visible={visible}/> }
            {filteredList.length <= 0 && 
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Could not find jobs
                </Alert>
            </div>
            }
        </div>
    )
}
