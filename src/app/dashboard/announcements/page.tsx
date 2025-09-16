import { deleteAnnouncement, getAnnouncements, getChannels, getRoles } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'
import { LogIn, MessageSquareWarning } from 'lucide-react'
import Link from 'next/link'

const announcementList = [
    'id',
    'title',
    'description',
    'channel',
    'roles',
    'interval',
    'date',
    'time',
    'sent',
    'last_sent',
    'active'
]

async function deleteAction(id: string) {
    'use server'
    await deleteAnnouncement(Number(id))
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

    const list = await getAnnouncements()
    const rolesResponse = await getRoles()
    const channelsResponse = await getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id }))
        : []
    const tempSort = Array.isArray(list) ? list : []

    if (typeof list === 'string') {
        return (
            <div
                className={
                    'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                    'overflow-hidden flex flex-col gap-2'
                }
            >
                <div className='flex gap-2 w-full rounded-lg p-2 bg-red-500'>
                    <MessageSquareWarning />
                    <h1 className='font-semibold'>Unauthorized</h1>
                </div>
                <div className='flex-none'>
                    <h1 className='font-semibold text-lg'>Announcements</h1>
                </div>
                <div className='grid place-items-center h-full'>
                    <Link
                        href={`${process.env.NEXT_PUBLIC_BROWSER_API}/oauth2/login`}
                        className='grid place-items-center'
                    >
                        <button
                            className={
                                'flex align-middle gap-2 mt-2 rounded-lg ' +
                                'bg-login px-8 py-1  hover:bg-orange-500 mb-2'
                            }
                        >
                            Login
                            <LogIn className='w-5' />
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className={
                'h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] ' +
                'overflow-hidden flex flex-col'
            }
        >
            <div className='flex-none'>
                <h1 className='font-semibold text-lg'>Announcements</h1>
                <div className='flex items-center justify-between py-3'>
                    <Search />
                    <div className='flex flex-row gap-[1rem]'>
                        <Button
                            text='New announcement'
                            icon='+'
                            path='announcements/create'
                        />
                    </div>
                </div>
            </div>
            <TempSort tempSort={tempSort} channels={channels} roles={roles} />
        </div>
    )
}

function TempSort({ tempSort, channels, roles }: { tempSort: object[], channels: Channel[], roles: Role[] }) {
    (tempSort as Announcement[]).forEach((announcement) => {
        (announcement.sent as unknown as string) = announcement.sent ? 'true' : 'false'
        announcement.channel = channels?.find((c) => c.value === announcement.channel)?.label
        announcement.roles?.forEach((role) => roles.find((r) => r.value === role)?.label)
    })

    if (
        typeof tempSort === 'string' ||
        !Array.isArray(tempSort) ||
        tempSort.length < 1
    ) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Alert>
                    {typeof tempSort === 'string'
                        ? tempSort
                        : 'No announcements found'}
                </Alert>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col overflow-hidden'>
            <Table
                list={tempSort}
                headers={announcementList}
                deleteAction={deleteAction}
            />
            <Pagination pageSize={10} totalRows={tempSort.length} />
        </div>
    )
}
