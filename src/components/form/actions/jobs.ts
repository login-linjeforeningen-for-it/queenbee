'use server'

import { putJob, postAnnouncement, postJob } from '@utils/api'
import {
    getOptionalBoolean, getRequiredNumber, getOptionalString, getRequiredString, getRequiredDateTime, getOptionalArray
} from '@utils/validate'
import { extractAnnouncementProps, anyMandatoryFieldSet } from './announcements'

type FormState =
    | null
    | string

type PostFormState = FormState | PostJobProps

type PutFormState = FormState | PutJobProps

function extractJobsProps<T extends PostJobProps | PutJobProps>(formData: FormData): T {
    return {
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
        time_expire:            getRequiredDateTime(formData, 'expire_date', 'expire_time', '23:59'),
        time_publish:           getRequiredDateTime(formData, 'publish_date', 'publish_time', '00:00'),
        title_en:               getRequiredString(formData, 'title_en'),
        title_no:               getRequiredString(formData, 'title_no'),
        visible:                true,
        cities:                 getOptionalArray(formData, 'cities'),
        skills:                 getOptionalArray(formData, 'skills')
    } as T
}

export async function createJob(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const jobProps = extractJobsProps<PostJobProps>(formData)

        let announcementProps: PostAnnouncementPropsUnparsed | string
        try {
            announcementProps = await extractAnnouncementProps<PostAnnouncementPropsUnparsed>(formData)
        } catch(error) {
            announcementProps = error instanceof Error ? error.message : 'Unknown error'
        }

        const response = await postJob(jobProps)

        if (typeof announcementProps !== 'string' && await anyMandatoryFieldSet(formData)) {
            await postAnnouncement({ ...announcementProps, roles: announcementProps.roles?.split(' ') || [] })
        } else if (typeof announcementProps === 'string' && await anyMandatoryFieldSet(formData)) {
            throw new Error(typeof announcementProps === 'string' ? announcementProps : 'No mandatory fields set for announcement')
        }

        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateJob(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const jobProps = extractJobsProps<PutJobProps>(formData)

        const id = Number(formData.get('id'))

        const response = await putJob(id, jobProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}