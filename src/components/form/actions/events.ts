'use server'

import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { putEvent, postAnnouncement, postEvent } from '@utils/api'
import {
    getOptionalBoolean, getOptionalNumber, getOptionalString, getRequiredString, getRequiredDateTime, getOptionalDateTime,
    getRequiredNumber
} from '@utils/validate'

export type FormState =
    | null
    | string
    | PostEventProps
    | PutEventProps

type PutEventProps = PostEventProps

export async function createEvent(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const eventProps: PostEventProps = {
            canceled:               getOptionalBoolean(formData, 'canceled') || false,
            capacity:               getOptionalNumber(formData, 'capacity'),
            category_id:            getRequiredNumber(formData, 'category'),
            description_en:         getRequiredString(formData, 'description_en'),
            description_no:         getRequiredString(formData, 'description_no'),
            digital:                getOptionalBoolean(formData, 'digital') || false,
            is_full:                getOptionalBoolean(formData, 'isFull') || false,
            highlight:              getOptionalBoolean(formData, 'highlight') || false,
            image_banner:           getOptionalString(formData, 'image_banner'),
            image_small:            getOptionalString(formData, 'image_small'),
            informational_en:       getRequiredString(formData, 'informational_en'),
            informational_no:       getRequiredString(formData, 'informational_no'),
            link_discord:           getOptionalString(formData, 'link_discord'),
            link_facebook:          getOptionalString(formData, 'link_facebook'),
            link_signup:            getOptionalString(formData, 'link_signup'),
            link_stream:            getOptionalString(formData, 'link_stream'),
            location_id:            getOptionalNumber(formData, 'location'),
            name_en:                getRequiredString(formData, 'name_en'),
            name_no:                getRequiredString(formData, 'name_no'),
            parent_id:              getOptionalNumber(formData, 'parent'),
            rule_id:                getOptionalNumber(formData, 'rule'),
            audience:               getOptionalString(formData, 'audience'),
            organization_id:        getOptionalNumber(formData, 'organization'),
            time_end:               getRequiredDateTime(formData, 'end_date', 'end_time'),
            time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time'),
            time_signup_deadline:   getOptionalDateTime(formData, 'deadline_date', 'deadline_time'),
            time_signup_release:    getOptionalDateTime(formData, 'release_date', 'release_time'),
            time_start:             getRequiredDateTime(formData, 'start_date', 'start_time'),
            time_type:              getRequiredString(formData, 'time_type') as time_type,
            visible:                getOptionalBoolean(formData, 'visible') || true,
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
        const eventProps: PutEventProps = {
            canceled:               getOptionalBoolean(formData, 'canceled') || false,
            capacity:               getOptionalNumber(formData, 'capacity'),
            category_id:            getRequiredNumber(formData, 'category'),
            description_en:         getRequiredString(formData, 'description_en'),
            description_no:         getRequiredString(formData, 'description_no'),
            digital:                getOptionalBoolean(formData, 'digital') || false,
            is_full:                getOptionalBoolean(formData, 'isFull') || false,
            highlight:              getOptionalBoolean(formData, 'highlight') || false,
            image_banner:           getOptionalString(formData, 'image_banner'),
            image_small:            getOptionalString(formData, 'image_small'),
            informational_en:       getRequiredString(formData, 'informational_en'),
            informational_no:       getRequiredString(formData, 'informational_no'),
            link_discord:           getOptionalString(formData, 'link_discord'),
            link_facebook:          getOptionalString(formData, 'link_facebook'),
            link_signup:            getOptionalString(formData, 'link_signup'),
            link_stream:            getOptionalString(formData, 'link_stream'),
            location_id:            getOptionalNumber(formData, 'location'),
            name_en:                getRequiredString(formData, 'name_en'),
            name_no:                getRequiredString(formData, 'name_no'),
            parent_id:              getOptionalNumber(formData, 'parent'),
            rule_id:                getOptionalNumber(formData, 'rule'),
            audience:               getOptionalString(formData, 'audience'),
            organization_id:        getOptionalNumber(formData, 'organization'),
            time_end:               getRequiredDateTime(formData, 'end_date', 'end_time'),
            time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time'),
            time_signup_deadline:   getOptionalDateTime(formData, 'deadline_date', 'deadline_time'),
            time_signup_release:    getOptionalDateTime(formData, 'release_date', 'release_time'),
            time_start:             getRequiredDateTime(formData, 'start_date', 'start_time'),
            time_type:              getRequiredString(formData, 'time_type') as time_type,
            visible:                getOptionalBoolean(formData, 'visible') || true,
        }

        const id = Number(formData.get('id'))

        const response = await putEvent(id, eventProps)
        return response
    } catch (error) {
        console.log('Error updating event:', error)
        throw error
    }
}