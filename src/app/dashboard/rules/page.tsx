import { deleteRule, getRules } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'

async function deleteAction(id: string) {
    'use server'
    await deleteRule(Number(id))
}

export default async function Page() {
    // export default async function Page({
    //     _,
    // }: {
    //     searchParams: Promise<{ [key: string]: string | undefined }>
    // }) {
    // const filters = await searchParams
    // const search = typeof filters.q === 'string' ? filters.q : ''
    // const page = typeof filters.page === 'string' ? Number(filters.page) : 1

    const list = await getRules()
    const tempSort = Array.isArray(list)
        ? list.filter((item) => !item.is_deleted)
        : []

    return (
        <div
            className={
                'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                'overflow-hidden flex flex-col'
            }
        >
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Rules</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-[1rem]'>
                        <Button text='New rule' icon='+' path='rules/create' />
                    </div>
                </div>
            </div>
            <TempSort tempSort={tempSort} />
        </div>
    )
}

function TempSort({ tempSort }: { tempSort: object[] }) {
    if (
        typeof tempSort === 'string' ||
        !Array.isArray(tempSort) ||
        tempSort.length < 1
    ) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    {typeof tempSort === 'string' ? tempSort : 'No rules found'}
                </Alert>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col overflow-hidden'>
            <Table
                list={tempSort}
                headers={['id', 'name_no', 'name_en']}
                deleteAction={deleteAction}
            />
            <Pagination pageSize={10} totalRows={tempSort.length} />
        </div>
    )
}
