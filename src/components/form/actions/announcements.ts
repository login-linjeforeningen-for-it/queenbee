'use server'

import postAnnouncement from '@utils/api/announcements/postAnnouncement'
import putAnnouncement from '@utils/api/announcements/putAnnouncement'
import { getOptionalDateTime, getOptionalString, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostAnnouncementProps

type PutFormState = FormState | PutAnnouncementProps

type Unparsed = PostAnnouncementPropsUnparsed | PutAnnouncementPropsUnparsed


export async function extractAnnouncementProps<T extends Unparsed>(formData: FormData): Promise<T> {
    return {
        title:          getRequiredString(formData, 'title'),
        description:    getRequiredString(formData, 'description'),
        channel:        getRequiredString(formData, 'channel'),
        roles:          getOptionalString(formData, 'roles'),
        embed:          getOptionalString(formData, 'embed') as embed_type === 'on',
        color:          getOptionalString(formData, 'color'),
        interval:       getOptionalString(formData, 'interval'),
        time:           getOptionalDateTime(formData, 'publish_date', 'publish_time'),
        active: true
    } as T
}

export async function anyMandatoryFieldSet(formData: FormData): Promise<boolean> {
    return Boolean(
        getOptionalString(formData, 'title') || getOptionalString(formData, 'description') || getOptionalString(formData, 'channel')
    )
}

export async function createAnnouncement(_: FormState, formData: FormData): Promise<PostFormState> {
    try {
        const announcementProps = await extractAnnouncementProps<PostAnnouncementPropsUnparsed>(formData)

        const response = await postAnnouncement({ ...announcementProps, roles: announcementProps.roles?.split(' ') || [] })
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateAnnouncement(_: FormState, formData: FormData): Promise<PutFormState> {
    try {
        const announcementProps = await extractAnnouncementProps<PutAnnouncementPropsUnparsed>(formData)

        const response = await putAnnouncement({ ...announcementProps, roles: announcementProps.roles?.split(' ') || [] })
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}