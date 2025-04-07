import { getOrganizations } from '@utils/api'
import React from 'react' 
import ClientPage from "./clientPage"
import Alert from '@components/alert/alert'

export default async function page() {
    const list = await getOrganizations()

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading organizations
            </Alert>
        </div>
    )

    const visible =  ['description_en', 'description_no', 'link_facebook', 'link_homepage', 'link_instagram', 'link_linkedin', 'logo', 'name_en', 'name_no', 'shortname']

    return <ClientPage list={list} visible={visible} />
}