'use server'

import { putAnnouncement, postAnnouncement } from '@/utils/api'

export type FormState =
    | null
    | string
    | PostAnnouncementProps
    | PutAnnouncementProps

export async function createAnnouncement(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const date = formData.get('publish_date') as string
        const time = formData.get('publish_time') as string
        const announcementProps: PostAnnouncementPropsUnparsed = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            channel: formData.get('channel') as string,
            roles: formData.get('roles') as string,
            embed: formData.get('embed') as embed_type === 'on',
            color: formData.get('color') as string,
            interval: formData.get('interval') as string,
            time: `${date}T${time}:00.000Z`,
            active: true
        }

        const response = await postAnnouncement({ ...announcementProps, roles: announcementProps.roles.split(' ') })
        return response
    } catch (error) {
        console.log('Error creating announcement:', error)
        throw error
    }
}

export async function updateAnnouncement(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const date = formData.get('publish_date') as string
        const time = formData.get('publish_time') as string
        const announcementProps: PutAnnouncementPropsUnparsed = {
            id: Number(formData.get('id')),
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            channel: formData.get('channel') as string,
            roles: formData.get('roles') as string,
            embed: formData.get('embed') as embed_type === 'on',
            color: formData.get('color') as string,
            interval: formData.get('interval') as string,
            time: `${date}T${time}:00.000Z`,
            active: true
        }

        const response = await putAnnouncement({ ...announcementProps, roles: announcementProps.roles.split(' ') })
        return response
    } catch (error) {
        console.log('Error updating announcement:', error)
        throw error
    }
}
