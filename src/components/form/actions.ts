/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { patchEvent, patchJob, postEvent, postJob, postOrganization, patchOrganization, postLocation, patchLocation, postRule, patchRule } from '@/utils/api'

export type FormState = ErrorResponse | object

export async function createEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const eventProps: PostEventProps = {
            canceled: false,
            capacity: 0,
            category: 0,
            description_en: '',
            description_no: '',
            digital: false,
            full: false,
            highlight: false,
            image_banner: '',
            image_small: '',
            informational_en: '',
            informational_no: '',
            link_discord: '',
            link_facebook: '',
            link_signup: '',
            link_stream: '',
            location: 0,
            name_en: '',
            name_no: '',
            parent: 0,
            rule: 0,
            time_end: '',
            time_publish: '',
            time_signup_deadline: '',
            time_signup_release: '',
            time_start: '',
            time_type: 'default',
            visible: false
        }
        
        const response = await postEvent(eventProps)
        return response
    } catch (error) {
        console.error('Error creating event:', error)
        throw error
    }
}

export async function updateEvent(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const eventProps: PatchEventProps = {
            id: 0,
            canceled: false,
            capacity: 0,
            category: 0,
            description_en: '',
            description_no: '',
            digital: false,
            full: false,
            highlight: false,
            image_banner: '',
            image_small: '',
            informational_en: '',
            informational_no: '',
            link_discord: '',
            link_facebook: '',
            link_signup: '',
            link_stream: '',
            location: 0,
            name_en: '',
            name_no: '',
            parent: 0,
            rule: 0,
            time_end: '',
            time_publish: '',
            time_signup_deadline: '',
            time_signup_release: '',
            time_start: '',
            time_type: 'default',
            visible: false
        }
        
        const response = await patchEvent(eventProps)
        return response
    } catch (error) {
        console.error('Error updating event:', error)
        throw error
    }
}

export async function createJob(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PostJobProps = {
            application_deadline: '',
            application_url: '',
            banner_image: '',
            description_long_en: '',
            description_long_no: '',
            description_short_en: '',
            description_short_no: '',
            highlight: false,
            job_type: 'full',
            organization: '',
            position_title_en: '',
            position_title_no: '',
            time_expire: '',
            time_publish: '',
            title_en: '',
            title_no: '',
            visible: false
        }

        const response = await postJob(jobProps)
        return response
    } catch (error) {
        console.error('Error creating job:', error)
        throw error
    }
}

export async function updateJob(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobProps: PatchJobProps = {
            id: 0,
            application_deadline: '',
            application_url: '',
            banner_image: '',
            description_long_en: '',
            description_long_no: '',
            description_short_en: '',
            description_short_no: '',
            highlight: false,
            job_type: 'full',
            organization: '',
            position_title_en: '',
            position_title_no: '',
            time_expire: '',
            time_publish: '',
            title_en: '',
            title_no: '',
            visible: false
        }

        const response = await patchJob(jobProps)
        return response
    } catch (error) {
        console.error('Error updating job:', error)
        throw error
    }
}

export async function createOrganization(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PostOrganizationProps = {
            description_en: '',
            description_no: '',
            link_facebook: '',
            link_homepage: '',
            link_instagram: '',
            link_linkedin: '',
            logo: '',
            name_en: '',
            name_no: '',
            shortname: '',
            type: 0
        }

        const response = await postOrganization(organizationProps)
        return response
    } catch (error) {
        console.error('Error creating organization:', error)
        throw error
    }
}

export async function updateOrganization(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PatchOrganizationProps = {
            description_en: '',
            description_no: '',
            link_facebook: '',
            link_homepage: '',
            link_instagram: '',
            link_linkedin: '',
            logo: '',
            name_en: '',
            name_no: '',
            shortname: '',
            type: 0
        }

        const response = await patchOrganization(organizationProps.shortname, organizationProps)
        return response
    } catch (error) {
        console.error('Error updating organization:', error)
        throw error
    }
}

export async function createLocation(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PostLocationProps = {
            address_postcode: 0,
            address_street: '',
            city_name: '',
            coordinate_lat: 0,
            coordinate_long: 0,
            mazemap_campus_id: 0,
            mazemap_poi_id: 0,
            name_en: '',
            name_no: '',
            type: 'mazemap',
            url: ''
        }

        const response = await postLocation(locationProps)
        return response
    } catch (error) {
        console.error('Error creating location:', error)
        throw error
    }
}

export async function updateLocation(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PatchLocationProps = {
            id: 0,
            address_postcode: 0,
            address_street: '',
            city_name: '',
            coordinate_lat: 0,
            coordinate_long: 0,
            mazemap_campus_id: 0,
            mazemap_poi_id: 0,
            name_en: '',
            name_no: '',
            type: 'mazemap',
            url: ''
        }

        const response = await patchLocation(locationProps)
        return response
    } catch (error) {
        console.error('Error updating location:', error)
        throw error
    }
}

export async function createRule(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PostRuleProps = {
            description_en: '',
            description_no: '',
            name_en: '',
            name_no: ''
        }

        const response = await postRule(ruleProps)
        return response
    } catch (error) {
        console.error('Error creating rule:', error)
        throw error
    }
}

export async function updateRule(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PatchRuleProps = {
            id: 0,
            description_en: '',
            description_no: '',
            name_en: '',
            name_no: ''
        }

        const response = await patchRule(ruleProps)
        return response
    } catch (error) {
        console.error('Error updating rule:', error)
        throw error
    }
}