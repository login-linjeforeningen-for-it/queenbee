import { getAnnouncement, getChannels, getRoles } from '@utils/api'
import {
    createAnnouncement,
    updateAnnouncement,
} from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { notFound } from 'next/navigation'
import AnnouncementFormInputs from '@components/form/server/announcements'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params
    const rolesResponse = await getRoles()
    const channelsResponse = await getChannels()
    const roles = Array.isArray(rolesResponse)
        ? rolesResponse.map((role) => ({ label: role.name, value: role.id, color: role.color }))
        : []
    const channels = Array.isArray(channelsResponse)
        ? channelsResponse.map((channel) => ({ label: channel.name, value: channel.id }))
        : []

    if (id) {
        const announcements = await getAnnouncement(Number(id[0]))
        if (
            typeof announcements === 'object' &&
            Object.keys(announcements).length > 0
        ) {
            const announcement = announcements[0]
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='announcement'
                        type='create'
                        preview={true}
                        formAction={createAnnouncement}
                        channels={channels}
                        roles={roles}
                    >
                        <AnnouncementFormInputs defaultValues={announcement} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='announcement'
                        type='update'
                        id={id[0]}
                        preview={true}
                        formAction={updateAnnouncement}
                        roles={roles}
                        channels={channels}
                    >
                        <AnnouncementFormInputs defaultValues={announcement} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='announcement'
                type='create'
                preview={true}
                formAction={createAnnouncement}
                roles={roles}
                channels={channels}
            >
                <AnnouncementFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
