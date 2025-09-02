import { getChannels } from '@utils/api'
import AnnouncementFormInputsClient from '../client/announcements'

export default async function AnnouncementFormInputs({
    defaultValues,
    parent
}: {
    defaultValues?: GetAnnouncementProps
    parent?: { preview?: boolean }
}) {
    const channelsResponse = await getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    return <AnnouncementFormInputsClient
        channels={channels}
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
