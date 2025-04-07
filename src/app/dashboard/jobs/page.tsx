import { getJobs } from '@utils/api'
import React from 'react' 
import ClientPage from './clientPage'
import Alert from '@components/alert/alert'

export default async function page() {
    const list = await getJobs()

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading jobs
            </Alert>
        </div>
    )

    const visible = ['id', 'name_no', 'title_no', 'job_type', 'time_publish', 'application_deadline', 'application_url', 'updated_at', 'visible']

    return <ClientPage list={list} visible={visible} />
}
