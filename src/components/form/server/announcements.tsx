import getRoles from '@utils/api/bot/announcements/getRoles'
import AnnouncementFields from '../client/announcementFields'
import getChannels from '@utils/api/bot/announcements/getChannels'
import DiscordPreview from '@components/preview/discord'

export default async function AnnouncementForm({
    defaultValues,
}: {
    defaultValues?: GetAnnouncementProps
}) {
    const rolesResponse = await getRoles()
    const channelsResponse = await getChannels()
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    return (
        <div className='grid grid-cols-2 gap-4'>
            <AnnouncementFields
                channels={channels}
                roles={roles}
                defaultValues={defaultValues}
            />
            <DiscordPreview channels={channels} roles={roles} />
        </div>
    )
}
