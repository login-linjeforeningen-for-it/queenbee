import { getJobs } from '@utils/api'
import React from 'react' 
import ClientPage from './clientPage'

export default async function page() {
    const list = await getJobs()
    const visible = ['id', 'name_no', 'title_no', 'job_type', 'time_publish', 'application_deadline', 'application_url', 'updated_at', 'visible']

    return <ClientPage list={list} visible={visible} />
}
