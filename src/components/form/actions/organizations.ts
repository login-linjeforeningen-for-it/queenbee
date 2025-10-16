'use server'

import { putOrganization, postOrganization } from '@utils/api'
import { getOptionalString, getRequiredString } from '@utils/validate'

export type FormState =
    | null
    | string
    | PostOrganizationProps
    | PutOrganizationProps

export async function createOrganization(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const organizationProps: PostOrganizationProps = {
            description_en: getRequiredString(formData, 'description_en'),
            description_no: getRequiredString(formData, 'description_no'),
            link_facebook:  getOptionalString(formData, 'link_facebook'),
            link_homepage:  getOptionalString(formData, 'link_homepage'),
            link_instagram: getOptionalString(formData, 'link_instagram'),
            link_linkedin:  getOptionalString(formData, 'link_linkedin'),
            logo:           getOptionalString(formData, 'logo'),
            name_en:        getRequiredString(formData, 'name_en'),
            name_no:        getRequiredString(formData, 'name_no'),
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
            description_en: getRequiredString(formData, 'description_en'),
            description_no: getRequiredString(formData, 'description_no'),
            link_facebook:  getOptionalString(formData, 'link_facebook'),
            link_homepage:  getOptionalString(formData, 'link_homepage'),
            link_instagram: getOptionalString(formData, 'link_instagram'),
            link_linkedin:  getOptionalString(formData, 'link_linkedin'),
            logo:           getOptionalString(formData, 'logo'),
            name_en:        getRequiredString(formData, 'name_en'),
            name_no:        getRequiredString(formData, 'name_no'),
        }

        const id = Number(formData.get('id'))

        const response = await putOrganization(id, organizationProps)
        return response
    } catch (error) {
        console.log('Error updating organization:', error)
        throw error
    }
}