'use server'

import postAnnouncement from '@utils/api/bot/announcements/postAnnouncement'
import putAnnouncement from '@utils/api/bot/announcements/putAnnouncement'
import { getOptionalBoolean, getOptionalDateTime, getOptionalString, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostAnnouncementProps

type PutFormState = FormState | PutAnnouncementProps

type Unparsed = PostAnnouncementPropsUnparsed | PutAnnouncementPropsUnparsed


export async function extractAnnouncementProps<T extends Unparsed>(formData: FormData): Promise<T> {
    const title_no = getOptionalString(formData, 'title_no')
    const title_en = getOptionalString(formData, 'title_en')
    const description_no = getOptionalString(formData, 'description_no')
    const description_en = getOptionalString(formData, 'description_en')

    if (!title_no && !title_en) throw new Error('Title is required')
    if (!description_no && !description_en) throw new Error('Description is required')

    return {
        title:          [title_no, title_en].filter((t) => t !== null) as string[],
        description:    [description_no, description_en].filter((t) => t !== null) as string[],
        channel:        getRequiredString(formData, 'channel'),
        roles:          getOptionalString(formData, 'roles'),
        embed:          getOptionalBoolean(formData, 'embed'),
        color:          getOptionalString(formData, 'color'),
        interval:       getOptionalString(formData, 'interval'),
        time:           getOptionalDateTime(formData, 'publish_date', 'publish_time'),
        active: true
    } as T
}

export async function isEnabled(formData: FormData): Promise<boolean> {
    return formData.get('announcement_enabled') === 'on'
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