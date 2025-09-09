import { getChannels, getRoles } from '@utils/api'
import AnnouncementFormInputsClient from '../client/announcements'

export default async function AnnouncementFormInputs({
    defaultValues,
    parent
}: {
    defaultValues?: GetAnnouncementProps
    parent?: { preview?: boolean }
}) {
    const rolesResponse = await getRoles()
    const channelsResponse = await getChannels()
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id }))
        : []
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    return <AnnouncementFormInputsClient
        channels={channels}
        roles={roles}
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
