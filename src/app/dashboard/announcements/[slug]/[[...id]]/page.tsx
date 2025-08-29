import { getAnnouncement } from '@utils/api'
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

    if (id) {
        const announcement = await getAnnouncement(Number(id[0]))
        if (
            typeof announcement === 'object' &&
            Object.keys(announcement).length > 0
        ) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='announcement'
                        type='create'
                        preview={true}
                        formAction={createAnnouncement}
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
            >
                <AnnouncementFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
