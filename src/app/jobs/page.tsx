"use client"
import { getJobs } from '@utils/api'
import Modal from '@components/modal/modal'
import React, { useState } from 'react' 
import List from '@components/list/list'

// Your previously provided getJobs function

export default function JobsPage() {
    const [showModal, setModal] = useState(false)
    const jobs = [
        {
          id: 1,
          title_no: "Telenor",
          title_en: "Telenor",
          position_title_no: "",
          position_title_en: "",
          job_type: "full",
          time_publish: "2024-01-30T22:00:35.806158+01:00",
          application_deadline: "2024-02-04T23:59:59+01:00",
          application_url: "https://telenorgroup.wd3.myworkdayjobs.com/TelenorGroup_careers/job/Fornebu/Nettverkskonsulent---Lead-Architect-Digital-Platform-_J117946/",
          updated_at: "2024-01-30T22:00:35.806158+01:00",
          visible: true,
          deleted_at: "0001-01-01T00:00:00Z",
          is_deleted: false,
          name_no: "Telenor",
          name_en: "Telenor"
        },
        {
          id: 2,
          title_no: "Norges Bank",
          title_en: "",
          position_title_no: "Studentengasjement Data Managament",
          position_title_en: "",
          job_type: "part",
          time_publish: "2024-02-07T21:04:21.998786+01:00",
          application_deadline: "2024-02-16T23:59:59+01:00",
          application_url: "https://398270.webcruiter.no/main/recruit/public/4761078473?&language=nb&use_position_site_header=0&culture_id=NB-NO&url_org=398270",
          updated_at: "2024-02-07T21:04:21.998786+01:00",
          visible: true,
          deleted_at: "0001-01-01T00:00:00Z",
          is_deleted: false,
          name_no: "Norges Bank",
          name_en: ""
        }
      ]
      
    const show = ['id', 'name_no', 'title_no', 'job_type', 'time_publish', 'application_deadline', 'application_url', 'updated_at', 'visible']

    return (
        <>
            <div className='max-w-[calc(100vw-var(--w-sidebar)-2rem)]'>
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
