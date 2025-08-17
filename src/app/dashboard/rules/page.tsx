import { deleteRule, getRules } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/userInput/button'
import Filter from '@components/userInput/filter'
import Table from '@components/table/table'

async function deleteAction(id: string) {
    'use server'
    await deleteRule(Number(id))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    // const filters = await searchParams
    // const search = typeof filters.q === 'string' ? filters.q : ''
    // const page = typeof filters.page === 'string' ? Number(filters.page) : 0
    // const offset = typeof filters.offset === 'string' ? Number(filters.offset) : 0

    const list = await getRules()

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden'>
            <div className='h-[var(--h-pageInfo)]'>
                <h1 className='font-semibold text-lg'>Rules</h1>
                <div className='flex justify-between pb-4'>
                    <Filter/>
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New rule' icon='+' path='rules/create' />
                    </div>
                </div>
            </div>
            {typeof list === 'string' || !Array.isArray(list) || list.length < 1 ?
                <div className='w-full h-full flex items-center justify-center'>
                    <Alert>
                        {typeof list === 'string' ? list : 'No rules found'}
                    </Alert>
                </div> 
                :
                <Table 
                    list={list.filter(item => !item.is_deleted)}
                    headers={['id', 'name_no', 'name_en']}
                    deleteAction={deleteAction}
                />
            }
        </div>
    )
}