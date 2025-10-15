'use server'

import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { putEvent, postAnnouncement, postEvent } from '@utils/api'
import { timeZoneOffset } from '@utils/timeZone'

export type FormState =
    | null
    | string
    | PostEventProps
    | PutEventProps

type PutEventProps = PostEventProps

export async function createEvent(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const timeZone = timeZoneOffset()
        const eventProps: PostEventProps = {
            canceled: formData.get('canceled') === 'true',
            capacity: Number(formData.get('capacity')),
            category: formData.get('category') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            digital: false,
            is_full: formData.get('isFull') === 'true',
            highlight: formData.get('highlight') === 'true',
            image_banner: formData.get('image_banner') as string,
            image_small: formData.get('image_small') as string,
            informational_en: formData.get('informational_en') as string,
            informational_no: formData.get('informational_no') as string,
            link_discord: formData.get('link_discord') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_signup: formData.get('link_signup') as string,
            link_stream: formData.get('link_stream') as string,
            location_id: Number(formData.get('location')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            parent_id: formData.get('parent') ? Number(formData.get('parent')) : null,
            rule_id: Number(formData.get('rule')),
            audience: formData.get('audience') as string,
            organization_id: formData.get('organization') ? Number(formData.get('organization')) : null,
            time_end:
                formData.get('end_date') && formData.get('end_time')
                    ? `${formData.get('end_date')}T` +
                    `${formData.get('end_time')}:00${timeZone}`
                    : '',
            time_publish:
                formData.get('publish_date') && formData.get('publish_time')
                    ? `${formData.get('publish_date')}T` +
                    `${formData.get('publish_time')}:00${timeZone}`
                    : '',
            // prettier-ignore
            time_signup_deadline: formData.get('link_signup')
                ? formData.get('deadline_date') && formData.get('deadline_time')
                    ? `${formData.get('deadline_date')}T` +
                    `${formData.get('deadline_time')}:00${timeZone}`
                    : formData.get('end_date') && formData.get('end_time')
                        ? `${formData.get('end_date')}T` +
                        `${formData.get('end_time')}:00${timeZone}`
                        : null
                : null,
            // prettier-ignore
            time_signup_release: formData.get('link_signup')
                ? formData.get('release_date') && formData.get('release_time')
                    ? `${formData.get('release_date')}T` +
                    `${formData.get('release_time')}:00${timeZone}`
                    : formData.get('publish_date') &&
                        formData.get('publish_time')
                        ? `${formData.get('publish_date')}T` +
                        `${formData.get('publish_time')}:00${timeZone}`
                        : null
                : null,
            // prettier-ignore
            time_start:
                formData.get('start_date') && formData.get('start_time')
                    ? `${formData.get('start_date')}T` +
                    `${formData.get('start_time')}:00${timeZone}`
                    : '',
            time_type: formData.get('time_type') as time_type,
            visible: true,
        }

        const announcementProps: PostAnnouncementPropsUnparsed = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            channel: formData.get('channel') as string,
            roles: formData.get('roles') as string,
            embed: formData.get('embed') as embed_type === 'on',
            color: formData.get('color') as string,
            interval: formData.get('interval') as string,
            time: formData.get('time') as string,
            active: true
        }

        const response = await postEvent(eventProps)
        if (anyMandatoryFieldSet(announcementProps)) {
            await postAnnouncement({ ...announcementProps, roles: announcementProps.roles.split(' ') })
        }

        return response
    } catch (error) {
        console.log('Error creating event:', error)
        throw error
    }
}

export async function updateEvent(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const timeZone = timeZoneOffset()
        const eventProps: PutEventProps = {
            canceled: false,
            capacity: Number(formData.get('capacity')),
            category: formData.get('category') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            digital: formData.get('digital') === 'true',
            is_full: formData.get('isFull') === 'true',
            highlight: formData.get('highlight') === 'true',
            image_banner: formData.get('image_banner') as string,
            image_small: formData.get('image_small') as string,
            informational_en: formData.get('informational_en') as string,
            informational_no: formData.get('informational_no') as string,
            link_discord: formData.get('link_discord') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_signup: formData.get('link_signup') as string,
            link_stream: formData.get('link_stream') as string,
            location_id: Number(formData.get('location')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            parent_id: formData.get('parent') ? Number(formData.get('parent')) : null,
            rule_id: Number(formData.get('rule')),
            audience: formData.get('audience') as string,
            organization_id: formData.get('organization') ? Number(formData.get('organization')) : null,
            time_end:
                formData.get('end_date') && formData.get('end_time')
                    ? `${formData.get('end_date')}T` +
                    `${formData.get('end_time')}:00${timeZone}`
                    : '',
            time_publish:
                formData.get('publish_date') && formData.get('publish_time')
                    ? `${formData.get('publish_date')}T` +
                    `${formData.get('publish_time')}:00${timeZone}`
                    : '',
            // prettier-ignore
            time_signup_deadline: formData.get('link_signup')
                ? formData.get('deadline_date') && formData.get('deadline_time')
                    ? `${formData.get('deadline_date')}T` +
                    `${formData.get('deadline_time')}:00${timeZone}`
                    : formData.get('end_date') && formData.get('end_time')
                        ? `${formData.get('end_date')}T` +
                        `${formData.get('end_time')}:00${timeZone}`
                        : ''
                : '',
            // prettier-ignore
            time_signup_release: formData.get('link_signup')
                ? formData.get('release_date') && formData.get('release_time')
                    ? `${formData.get('release_date')}T` +
                    `${formData.get('release_time')}:00${timeZone}`
                    : formData.get('publish_date') &&
                        formData.get('publish_time')
                        ? `${formData.get('publish_date')}` +
                        `T${formData.get('publish_time')}:00${timeZone}`
                        : ''
                : '',
            time_start:
                formData.get('start_date') && formData.get('start_time')
                    ? `${formData.get('start_date')}T` +
                    `${formData.get('start_time')}:00${timeZone}`
                    : '',
            time_type: formData.get('time_type') as time_type,
            visible: true,
        }

        const id = Number(formData.get('id'))

        const response = await putEvent(id, eventProps)
        return response
    } catch (error) {
        console.log('Error updating event:', error)
        throw error
    }
}