import FormWrapper from '@components/form/wrapper'
import AnnouncementForm from '@components/form/server/announcements'
import getAnnouncement from '@utils/api/bot/announcements/getAnnouncement'
import { createAnnouncement, updateAnnouncement } from '@components/form/actions/announcements'
import { notFound } from 'next/navigation'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params

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
                        path='announcements'
                        type='create'
                        formAction={createAnnouncement}
                    >
                        <AnnouncementForm defaultValues={announcement} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='announcement'
                        path='announcements'
                        type='update'
                        id={id[0]}
                        formAction={updateAnnouncement}
                    >
                        <AnnouncementForm defaultValues={announcement} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='announcement'
                path='announcements'
                type='create'
                formAction={createAnnouncement}
            >
                <AnnouncementForm />
            </FormWrapper>
        )
    }

    notFound()
}
