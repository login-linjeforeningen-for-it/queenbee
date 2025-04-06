import { getOrganizations } from '@utils/api'
import React from 'react' 
import ClientPage from "./clientPage"

export default async function page() {
    const list = await getOrganizations()
    const visible =  ['description_en', 'description_no', 'link_facebook', 'link_homepage', 'link_instagram', 'link_linkedin', 'logo', 'name_en', 'name_no', 'shortname']

    return <ClientPage list={list} visible={visible} />
}