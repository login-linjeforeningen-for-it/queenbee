import { deleteAnnouncement, getAnnouncements, getChannels, getRoles } from '@utils/api'
import Alert from '@components/alert/alert'
import Button from '@components/button/button'
import Search from '@components/inputs/search'
import Table from '@components/table/table'
import Pagination from '@components/table/pagination'

const announcementList = [
    'id',
    'title',
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

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const filters = await searchParams
    const search = typeof filters.q === 'string' ? filters.q : ''
    const offset = typeof filters.page === 'string' ? Number(filters.page)-1 : 0
    const limit = 14
    const orderBy = typeof filters.column === 'string' ? filters.column : 'id'
    const sort = typeof filters.order === 'string' && (filters.order === 'asc' || filters.order === 'desc')
        ? filters.order
        : 'asc'

    const list = await getAnnouncements({
        search,
        offset,
        limit,
        orderBy,
        sort,
    })
    const rolesResponse = await getRoles()
    const channelsResponse = await getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []

    return (
        <div className='h-full max-w-[calc(100vw-var(--w-sidebar)-2rem)] overflow-hidden flex flex-col'>
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
            <Sort tempSort={list} channels={channels} roles={roles} limit={limit} />
        </div>
    )
}

function Sort({ tempSort, channels, roles, limit }: {
    tempSort: Announcement[] | { announcements: Announcement[], total_count: number } | string,
    channels: Channel[],
    roles: Role[],
    limit: number
}) {
    let announcements: Announcement[] = []
    let totalCount = 0

    if (typeof tempSort === 'object' && tempSort !== null && 'announcements' in tempSort) {
        announcements = tempSort.announcements
        totalCount = tempSort.total_count
    } else if (Array.isArray(tempSort)) {
        announcements = tempSort
        totalCount = tempSort.length
    }

    announcements.forEach((announcement) => {
        (announcement.sent as unknown as string) = announcement.sent ? 'true' : 'false'
        announcement.channel = channels?.find((c) => c.value === announcement.channel)?.label
        announcement.roles = announcement.roles?.map((role) => roles.find((r) => r.value === role)?.label || '') ?? []
    })

    if (
        typeof tempSort === 'string' ||
        !Array.isArray(announcements) ||
        announcements.length < 1
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
                list={announcements}
                headers={announcementList}
                deleteAction={deleteAction}
            />
            <Pagination pageSize={limit} totalRows={Number(totalCount)} />
        </div>
    )
}
