'use server'

import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { putJob, postAnnouncement, postJob } from '@utils/api'
import {
    getOptionalBoolean, getRequiredNumber, getOptionalString, getRequiredString, getRequiredDateTime, getOptionalArray
} from '@utils/validate'

export type FormState =
    | null
    | string
    | PostJobProps
    | PutJobProps

export async function createJob(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PostJobProps = {
            application_url:        getOptionalString(formData, 'application_url'),
            banner_image:           getOptionalString(formData, 'banner_image'),
            description_long_en:    getRequiredString(formData, 'description_long_en'),
            description_long_no:    getRequiredString(formData, 'description_long_no'),
            description_short_en:   getRequiredString(formData, 'description_short_en'),
            description_short_no:   getRequiredString(formData, 'description_short_no'),
            highlight:              getOptionalBoolean(formData, 'highlight') || false,
            job_type_id:            getRequiredNumber(formData, 'job_type_id'),
            organization_id:        getRequiredNumber(formData, 'organization'),
            position_title_en:      getRequiredString(formData, 'position_title_en'),
            position_title_no:      getRequiredString(formData, 'position_title_no'),
            time_expire:            getRequiredDateTime(formData, 'expire_date', 'expire_time'),
            time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time'),
            title_en:               getRequiredString(formData, 'title_en'),
            title_no:               getRequiredString(formData, 'title_no'),
            visible:                getOptionalBoolean(formData, 'visible') || false,
            cities:                 getOptionalArray(formData, 'cities'),
            skills:                 getOptionalArray(formData, 'skills')
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

        const response = await postJob(jobProps)
        if (anyMandatoryFieldSet(announcementProps)) {
            await postAnnouncement({ ...announcementProps, roles: announcementProps.roles.split(' ') })
        }

        return response
    } catch (error) {
        console.log('Error creating job:', error)
        throw error
    }
}

export async function updateJob(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PutJobProps = {
            application_url:        getOptionalString(formData, 'application_url') as string,
            banner_image:           getOptionalString(formData, 'banner_image') as string,
            description_long_en:    getRequiredString(formData, 'description_long_en'),
            description_long_no:    getRequiredString(formData, 'description_long_no'),
            description_short_en:   getRequiredString(formData, 'description_short_en'),
            description_short_no:   getRequiredString(formData, 'description_short_no'),
            highlight:              getOptionalBoolean(formData, 'highlight') || false,
            job_type_id:            getRequiredNumber(formData, 'job_type_id'),
            organization_id:        getRequiredNumber(formData, 'organization'),
            position_title_en:      getRequiredString(formData, 'position_title_en'),
            position_title_no:      getRequiredString(formData, 'position_title_no'),
            time_expire:            getRequiredDateTime(formData, 'expire_date', 'expire_time'),
            time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time'),
            title_en:               getRequiredString(formData, 'title_en'),
            title_no:               getRequiredString(formData, 'title_no'),
            visible:                getOptionalBoolean(formData, 'visible') || false,
            cities:                 getOptionalArray(formData, 'cities'),
            skills:                 getOptionalArray(formData, 'skills')
        }

        const id = Number(formData.get('id'))

        const response = await putJob(id, jobProps)
        return response
    } catch (error) {
        console.log('Error updating job:', error)
        throw error
    }
}