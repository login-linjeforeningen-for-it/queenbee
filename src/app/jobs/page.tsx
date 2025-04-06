"use client"
import { getJobs } from '@utils/api'
import Modal from '@components/modal/modal'
import React, { useState } from 'react' 
import List from '@components/list/list'

// Your previously provided getJobs function

export default async function JobsPage() {
    const [showModal, setModal] = useState(false)
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
