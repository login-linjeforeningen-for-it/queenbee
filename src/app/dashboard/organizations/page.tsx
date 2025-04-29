import { getOrganizations } from '@utils/api'
import Alert from '@components/alert/alert'
import FilterList from '@components/filterList/filterList'
import List from '@components/list/list'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
import Link from 'next/link'
import Delete from '@components/svg/delete'

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const filterText = typeof filters.q === 'string' ? filters.q : ''
    const pageNumber = typeof filters.p === 'string' ? Number(filters.p) : 0

    const limit = 200
    const listLimit = 10
    const list = await getOrganizations(limit)

    if(typeof list === 'string') return (
        <div className='w-full h-full flex items-center justify-center'>
            <Alert>
                Error loading organizations
            </Alert>
        </div>
    )

    const filteredList = filterText !== '' ? FilterList({ list, filterText }).splice(0,listLimit) : list.splice(0,listLimit)
    const visible =  ['description_en', 'description_no', 'link_facebook', 'link_homepage', 'link_instagram', 'link_linkedin', 'logo', 'name_en', 'name_no', 'shortname']

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Organizations</h1>
                <div className='flex justify-between pb-4'>
                    <Filter/>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New organization' icon='+' path='organizations/0' />
                        <Link href='' className='bg-red-900 cursor-pointer px-4 rounded-md h-8 flex justify-evenly items-center gap-2 select-none'>
                            <Delete className='fill-bright'/>
                            Delete
                        </Link>
                    </div>
                </div>
            </div>
            {filteredList.length > 0 && <List sticky={['shortname']} list={filteredList} visible={visible}/> }
            {filteredList.length <= 0 && 
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    Could not find organizations
                </Alert>
            </div>
            }
        </div>
    )
}
