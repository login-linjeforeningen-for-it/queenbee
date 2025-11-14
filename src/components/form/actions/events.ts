'use server'

import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { putEvent, postAnnouncement, postEvent } from '@utils/api'
import {
    getOptionalBoolean, getOptionalNumber, getOptionalString, getRequiredString, getRequiredDateTime, getOptionalDateTime,
    getRequiredNumber,
    getRequiredDate
} from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostEventProps

type PutFormState = FormState | PutEventProps

function extractEventProps<T extends PostEventProps | PutEventProps>(formData: FormData): T {
    return {
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
        informational_en:       getOptionalString(formData, 'informational_en'),
        informational_no:       getOptionalString(formData, 'informational_no'),
        link_discord:           getOptionalString(formData, 'link_discord'),
        link_facebook:          getOptionalString(formData, 'link_facebook'),
        link_signup:            getOptionalString(formData, 'link_signup'),
        link_stream:            getOptionalString(formData, 'link_stream'),
        location_id:            getOptionalNumber(formData, 'location'),
        name_en:                getRequiredString(formData, 'name_en'),
        name_no:                getRequiredString(formData, 'name_no'),
        parent_id:              getOptionalNumber(formData, 'parent'),
        rule_id:                getOptionalNumber(formData, 'rule'),
        audience_id:            getOptionalNumber(formData, 'audience_id'),
        organization_id:        getOptionalNumber(formData, 'organization'),
        time_end:               getRequiredDateTime(formData, 'end_date', 'end_time', '23:59'),
        time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time', '00:00'),
        time_signup_deadline:   getOptionalDateTime(formData, 'deadline_date', 'deadline_time', '23:59'),
        time_signup_release:    getOptionalDateTime(formData, 'release_date', 'release_time', '00:00'),
        time_start:             getRequiredDateTime(formData, 'start_date', 'start_time', '00:00'),
        time_type:              getRequiredString(formData, 'time_type') as time_type,
        visible:                getOptionalBoolean(formData, 'visible') || true,
    } as T
}

export async function createEvent(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const eventProps = extractEventProps<PostEventProps>(formData)

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

        const repeat_until = getOptionalBoolean(formData, 'repeat_weekly') ? getRequiredDate(formData, 'repeat_until') : null

        const response = await postEvent(eventProps, repeat_until)
        if (anyMandatoryFieldSet(announcementProps)) {
            await postAnnouncement({ ...announcementProps, roles: announcementProps.roles.split(' ') })
        }

        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateEvent(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const eventProps = extractEventProps<PutEventProps>(formData)
        const id = Number(formData.get('id'))

        const response = await putEvent(id, eventProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}