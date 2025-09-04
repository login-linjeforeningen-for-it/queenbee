type AnnouncementInput = {
    title: string
    description: string
    channel: string
    embed: boolean
    color: string
    interval: string
    time: string | null
}

export default function anyMandatoryFieldSet(form: AnnouncementInput) {
    if (form.title?.length > 0 || form.description?.length > 0 || form.channel?.length > 0) {
        return true
    }
}
