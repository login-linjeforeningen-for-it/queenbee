import ManagedTable from '@components/table/managedTable'
import deleteAnnouncement from '@utils/api/bot/announcements/deleteAnnouncement'
import getAnnouncements from '@utils/api/bot/announcements/getAnnouncements'
import getRoles from '@utils/api/bot/announcements/getRoles'
import getChannels from '@utils/api/bot/announcements/getChannels'
import ListPage from '@components/table/listPage'
import { RoleRenderer } from '@components/preview/discordRole'

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
    return await deleteAnnouncement(Number(id))
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

    const [list, rolesResponse, channelsResponse] = await Promise.all([
        getAnnouncements({ search, offset, limit, orderBy, sort }),
        getRoles(),
        getChannels(),
    ])
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []

    return (
        <ListPage title='Announcements' createText='New announcement' createPath='announcements/create'>
            <Sort tempSort={list} channels={channels} roles={roles} limit={limit} />
        </ListPage>
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
    })

    const processedAnnouncements = announcements.map(a => ({
        ...a,
        roles: roles.length
            ? (
                <div className='flex flex-wrap gap-1'>
                    {((a.roles ?? []) as unknown as string[]).map((roleId, idx) => (
                        <RoleRenderer key={idx} roleId={roleId} roles={roles} />
                    ))}
                </div>
            )
            : a.roles
    }))

    return (
        <div className='flex-1 flex flex-col overflow-hidden'>
            <ManagedTable
                data={processedAnnouncements as unknown as Record<string, unknown>[]}
                columns={announcementList.map(key => key === 'title' ? { key, truncate: true, width: '20rem' } : { key })}
                rawKeys={['roles']}
                deleteAction={deleteAction}
                error={typeof tempSort === 'string' ? tempSort : undefined}
                redirectPath='/announcements/update'
                totalRows={Number(totalCount)}
                pageSize={limit}
            />
        </div>
    )
}
