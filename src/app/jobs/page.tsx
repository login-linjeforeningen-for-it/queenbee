import { getJobs } from '@utils/api'
import React from 'react' 
import List from '@components/list/list'

export default async function JobsPage() {
    const jobs = await getJobs()
      
    const show = ['id', 'name_no', 'title_no', 'job_type', 'time_publish', 'application_deadline', 'application_url', 'updated_at', 'visible']

    return (
        <>
            <div className='h-[var(--h-pageInfo)] max-w-[calc(100vw-var(--w-sidebar)-2rem)]'>
                <h1 className="font-semibold text-lg">Jobs</h1>
                <div className='flex justify-between'>
                    <h1>Filter (only text atm)</h1>
                    <h1>new job</h1>
                </div>
                <List sticky={['id']} list={jobs} visible={show}/>
            </div>
        </>
    )
}
