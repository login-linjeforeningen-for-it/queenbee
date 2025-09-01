import { getChannels } from '@utils/api'
import AnnouncementFormInputsClient from '../client/announcements'

export default function AnnouncementFormInputs({
    defaultValues,
    parent
}: {
    defaultValues?: GetAnnouncementProps
    parent?: { preview?: boolean }
}) {
    const channelsResponse = getChannels()
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ ...channel }))
        : []

    return <AnnouncementFormInputsClient
        channels={channels}
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
