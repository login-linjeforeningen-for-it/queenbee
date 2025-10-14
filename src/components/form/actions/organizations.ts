'use server'

import { putOrganization, postOrganization } from '@utils/api'

export type FormState =
    | null
    | string
    | PostOrganizationProps
    | PutOrganizationProps

export async function createOrganization(_: FormState, formData: FormData): Promise<FormState> {
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
            type: Number(formData.get('type')),
        }

        const response = await postOrganization(organizationProps)
        return response
    } catch (error) {
        console.log('Error creating organization:', error)
        throw error
    }
}

export async function updateOrganization(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PutOrganizationProps = {
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
            link_facebook: formData.get('link_facebook') as string,
            link_homepage: formData.get('link_homepage') as string,
            link_instagram: formData.get('link_instagram') as string,
            link_linkedin: formData.get('link_linkedin') as string,
            logo: formData.get('logo') as string,
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            type: Number(formData.get('type')),
        }

        const id = Number(formData.get('id'))

        const response = await putOrganization(id, organizationProps)
        return response
    } catch (error) {
        console.log('Error updating organization:', error)
        throw error
    }
}