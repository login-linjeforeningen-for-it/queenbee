import AnnouncementFormInputsClient from '../client/announcements'

export default function AnnouncementFormInputs({
    defaultValues,
    parent
}: {
    defaultValues?: GetAnnouncementProps
    parent?: { preview?: boolean }
}) {
    return <AnnouncementFormInputsClient
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
