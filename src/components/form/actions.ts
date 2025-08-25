'use server'

import { patchEvent, patchJob, postEvent, postJob, postOrganization, patchOrganization, postLocation, patchLocation, postRule, patchRule } from '@/utils/api'
import { patchEventSchema, patchJobSchema, patchLocationSchema, patchOrganizationSchema, patchRuleSchema, postEventSchema, postJobSchema, postLocationSchema, postOrganizationSchema, postRuleSchema } from './schemas'
import z from 'zod'

export type FormState = null | string | PostRuleProps | PostEventProps | PostJobProps | PostOrganizationProps | PostLocationProps | PatchRuleProps | PatchEventProps | PatchJobProps | PatchOrganizationProps | PatchLocationProps

export async function createEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const eventProps: PostEventProps = {
            canceled: false,
            capacity: Number(formData.get('capacity')),
            category: Number(formData.get('category')),
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            digital: false,
            full: formData.get('isFull') === 'true',
            highlight: formData.get('highlight') === 'true',
            image_banner: formData.get('image_banner') as string,
            image_small: formData.get('image_small') as string,
            informational_en: formData.get('informational_en') as string,
            informational_no: formData.get('informational_no') as string,
            link_discord: formData.get('link_discord') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_signup: formData.get('link_signup') as string,
            link_stream: formData.get('link_stream') as string,
            location: Number(formData.get('location')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            parent: Number(formData.get('parent')),
            rule: Number(formData.get('rule')),
            time_end: formData.get('end_date') && formData.get('end_time') ? `${formData.get('end_date')}T${formData.get('end_time')}:00Z` : '',
            time_publish: formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '',
            time_signup_deadline: formData.get('link_signup') ? formData.get('deadline_date') && formData.get('deadline_time') ? `${formData.get('deadline_date')}T${formData.get('deadline_time')}:00Z` : formData.get('end_date') && formData.get('end_time') ? `${formData.get('end_date')}T${formData.get('end_time')}:00Z` : '' : '',
            time_signup_release: formData.get('link_signup') ? formData.get('release_date') && formData.get('release_time') ? `${formData.get('release_date')}T${formData.get('release_time')}:00Z` : formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '' : '',
            time_start: formData.get('start_date') && formData.get('start_time') ? `${formData.get('start_date')}T${formData.get('start_time')}:00Z` : '',
            time_type: formData.get('time_type') as time_type,
            visible: true
        }

        const result = postEventSchema.safeParse(eventProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await postEvent(eventProps)
        return response
    } catch(error) {
        console.error('Error creating event:', error)
        throw error
    }
}

export async function updateEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const eventProps: PatchEventProps = {
            id: Number(formData.get('id')),
            canceled: false,
            capacity: Number(formData.get('capacity')),
            category: Number(formData.get('category')),
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            digital: formData.get('digital') === 'true',
            full: formData.get('isFull') === 'true',
            highlight: formData.get('highlight') === 'true',
            image_banner: formData.get('image_banner') as string,
            image_small: formData.get('image_small') as string,
            informational_en: formData.get('informational_en') as string,
            informational_no: formData.get('informational_no') as string,
            link_discord: formData.get('link_discord') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_signup: formData.get('link_signup') as string,
            link_stream: formData.get('link_stream') as string,
            location: Number(formData.get('location')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            parent: Number(formData.get('parent')),
            rule: Number(formData.get('rule')),
            time_end: formData.get('end_date') && formData.get('end_time') ? `${formData.get('end_date')}T${formData.get('end_time')}:00Z` : '',
            time_publish: formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '',
            time_signup_deadline: formData.get('link_signup') ? formData.get('deadline_date') && formData.get('deadline_time') ? `${formData.get('deadline_date')}T${formData.get('deadline_time')}:00Z` : formData.get('end_date') && formData.get('end_time') ? `${formData.get('end_date')}T${formData.get('end_time')}:00Z` : '' : '',
            time_signup_release: formData.get('link_signup') ? formData.get('release_date') && formData.get('release_time') ? `${formData.get('release_date')}T${formData.get('release_time')}:00Z` : formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '' : '',
            time_start: formData.get('start_date') && formData.get('start_time') ? `${formData.get('start_date')}T${formData.get('start_time')}:00Z` : '',
            time_type: formData.get('time_type') as time_type,
            visible: true
        }

        const result = patchEventSchema.safeParse(eventProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await patchEvent(eventProps)
        return response
    } catch(error) {
        console.error('Error updating event:', error)
        throw error
    }
}

export async function createJob(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PostJobProps = {
            application_deadline: formData.get('deadline_date') && formData.get('deadline_time') ? `${formData.get('deadline_date')}T${formData.get('deadline_time')}:00Z` : '',
            application_url: formData.get('application_url') as string,
            banner_image: formData.get('banner_image') as string,
            description_long_en: formData.get('description_long_en') as string,
            description_long_no: formData.get('description_long_no') as string,
            description_short_en: formData.get('description_short_en') as string,
            description_short_no: formData.get('description_short_no') as string,
            highlight: formData.get('highlight') === 'true',
            job_type: formData.get('job_type') as job_type,
            organization: formData.get('organization') as string,
            position_title_en: formData.get('position_title_en') as string,
            position_title_no: formData.get('position_title_no') as string,
            time_expire: formData.get('expire_date') && formData.get('expire_time') ? `${formData.get('expire_date')}T${formData.get('expire_time')}:00Z` : '',
            time_publish: formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '',
            title_en: formData.get('title_en') as string,
            title_no: formData.get('title_no') as string,
            visible: true
        }

        const result = postJobSchema.safeParse(jobProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await postJob(jobProps)
        return response
    } catch(error) {
        console.error('Error creating job:', error)
        throw error
    }
}

export async function updateJob(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PatchJobProps = {
            id: Number(formData.get('id')),
            application_deadline: formData.get('deadline_date') && formData.get('deadline_time') ? `${formData.get('deadline_date')}T${formData.get('deadline_time')}:00Z` : '',
            application_url: formData.get('application_url') as string,
            banner_image: formData.get('banner_image') as string,
            description_long_en: formData.get('description_long_en') as string,
            description_long_no: formData.get('description_long_no') as string,
            description_short_en: formData.get('description_short_en') as string,
            description_short_no: formData.get('description_short_no') as string,
            highlight: formData.get('highlight') === 'true',
            job_type: formData.get('job_type') as job_type,
            organization: formData.get('organization') as string,
            position_title_en: formData.get('position_title_en') as string,
            position_title_no: formData.get('position_title_no') as string,
            time_expire: formData.get('expire_date') && formData.get('expire_time') ? `${formData.get('expire_date')}T${formData.get('expire_time')}:00Z` : '',
            time_publish: formData.get('publish_date') && formData.get('publish_time') ? `${formData.get('publish_date')}T${formData.get('publish_time')}:00Z` : '',
            title_en: formData.get('title_en') as string,
            title_no: formData.get('title_no') as string,
            visible: true
        }

        const result = patchJobSchema.safeParse(jobProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await patchJob(jobProps)
        return response
    } catch(error) {
        console.error('Error updating job:', error)
        throw error
    }
}

export async function createOrganization(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PostOrganizationProps = {
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_homepage: formData.get('link_homepage') as string,
            link_instagram: formData.get('link_instagram') as string,
            link_linkedin: formData.get('link_linkedin') as string,
            logo: formData.get('logo') as string,
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            shortname: formData.get('shortname') as string,
            type: Number(formData.get('type'))
        }

        const result = postOrganizationSchema.safeParse(organizationProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await postOrganization(organizationProps)
        return response
    } catch(error) {
        console.error('Error creating organization:', error)
        throw error
    }
}

export async function updateOrganization(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PatchOrganizationProps = {
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_homepage: formData.get('link_homepage') as string,
            link_instagram: formData.get('link_instagram') as string,
            link_linkedin: formData.get('link_linkedin') as string,
            logo: formData.get('logo') as string,
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            shortname: formData.get('shortname') as string,
            type: Number(formData.get('type'))
        }

        const result = patchOrganizationSchema.safeParse(organizationProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await patchOrganization(organizationProps.shortname, organizationProps)
        return response
    } catch(error) {
        console.error('Error updating organization:', error)
        throw error
    }
}

export async function createLocation(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PostLocationProps = {
            address_postcode: Number(formData.get('address_postcode')),
            address_street: formData.get('address_street') as string,
            city_name: formData.get('city_name') as string,
            coordinate_lat: Number(formData.get('coordinate_lat')),
            coordinate_long: Number(formData.get('coordinate_long')),
            mazemap_campus_id: Number(formData.get('mazemap_campus_id')),
            mazemap_poi_id: Number(formData.get('mazemap_poi_id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            type: formData.get('type') as location_type,
            url: formData.get('url') as string
        }

        const result = postLocationSchema.safeParse(locationProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await postLocation(locationProps)
        return response
    } catch(error) {
        console.error('Error creating location:', error)
        throw error
    }
}

export async function updateLocation(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PatchLocationProps = {
            id: Number(formData.get('id')),
            address_postcode: Number(formData.get('address_postcode')),
            address_street: formData.get('address_street') as string,
            city_name: formData.get('city_name') as string,
            coordinate_lat: Number(formData.get('coordinate_lat')),
            coordinate_long: Number(formData.get('coordinate_long')),
            mazemap_campus_id: Number(formData.get('mazemap_campus_id')),
            mazemap_poi_id: Number(formData.get('mazemap_poi_id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            type: formData.get('type') as location_type,
            url: formData.get('url') as string
        }

        const result = patchLocationSchema.safeParse(locationProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await patchLocation(locationProps)
        return response
    } catch(error) {
        console.error('Error updating location:', error)
        throw error
    }
}

export async function createRule(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PostRuleProps = {
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string
        }

        const result = postRuleSchema.safeParse(ruleProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await postRule(ruleProps)
        return response
    } catch(error) {
        console.error('Error creating rule:', error)
        throw error
    }
}

export async function updateRule(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PatchRuleProps = {
            id: Number(formData.get('id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string
        }

        const result = patchRuleSchema.safeParse(ruleProps)
        if (!result.success) {
            return z.prettifyError(result.error)
        }

        const response = await patchRule(ruleProps)
        return response
    } catch(error) {
        console.error('Error updating rule:', error)
        throw error
    }
}