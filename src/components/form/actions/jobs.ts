'use server'

import anyMandatoryFieldSet from '@utils/announce/anyMandatoryFieldSet'
import { putJob, postAnnouncement, postJob } from '@utils/api'
import { timeZoneOffset } from '@utils/timeZone'

export type FormState =
    | null
    | string
    | PostJobProps
    | PutJobProps

export async function createJob(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const timeZone = timeZoneOffset()
        const jobProps: PostJobProps = {
            application_deadline:
                formData.get('deadline_date') && formData.get('deadline_time')
                    ? `${formData.get('deadline_date')}T` +
                    `${formData.get('deadline_time')}:00${timeZone}`
                    : '',
            application_url: formData.get('application_url') as string,
            banner_image: formData.get('banner_image') as string,
            description_long_en: formData.get('description_long_en') as string,
            description_long_no: formData.get('description_long_no') as string,
            description_short_en: formData.get(
                'description_short_en'
            ) as string,
            description_short_no: formData.get(
                'description_short_no'
            ) as string,
            highlight: formData.get('highlight') === 'true',
            job_type: formData.get('job_type') as job_type,
            organization: formData.get('organization') as string,
            position_title_en: formData.get('position_title_en') as string,
            position_title_no: formData.get('position_title_no') as string,
            time_expire:
                formData.get('expire_date') && formData.get('expire_time')
                    ? `${formData.get('expire_date')}T` +
                    `${formData.get('expire_time')}:00${timeZone}`
                    : '',
            time_publish:
                formData.get('publish_date') && formData.get('publish_time')
                    ? `${formData.get('publish_date')}T` +
                    `${formData.get('publish_time')}:00${timeZone}`
                    : '',
            title_en: formData.get('title_en') as string,
            title_no: formData.get('title_no') as string,
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
        const timeZone = timeZoneOffset()
        const jobProps: PutJobProps = {
            id: Number(formData.get('id')),
            application_deadline:
                formData.get('deadline_date') && formData.get('deadline_time')
                    ? `${formData.get('deadline_date')}T` +
                    `${formData.get('deadline_time')}:00${timeZone}`
                    : '',
            application_url: formData.get('application_url') as string,
            banner_image: formData.get('banner_image') as string,
            description_long_en: formData.get('description_long_en') as string,
            description_long_no: formData.get('description_long_no') as string,
            description_short_en: formData.get(
                'description_short_en'
            ) as string,
            description_short_no: formData.get(
                'description_short_no'
            ) as string,
            highlight: formData.get('highlight') === 'true',
            job_type: formData.get('job_type') as job_type,
            organization: formData.get('organization') as string,
            position_title_en: formData.get('position_title_en') as string,
            position_title_no: formData.get('position_title_no') as string,
            time_expire:
                formData.get('expire_date') && formData.get('expire_time')
                    ? `${formData.get('expire_date')}T` +
                    `${formData.get('expire_time')}:00${timeZone}`
                    : '',
            time_publish:
                formData.get('publish_date') && formData.get('publish_time')
                    ? `${formData.get('publish_date')}T` +
                    `${formData.get('publish_time')}:00${timeZone}`
                    : '',
            title_en: formData.get('title_en') as string,
            title_no: formData.get('title_no') as string,
            visible: true,
        }

        const response = await putJob(jobProps)
        return response
    } catch (error) {
        console.log('Error updating job:', error)
        throw error
    }
}