'use server'

import postOrganization from '@utils/api/organizations/postOrganization'
import putOrganization from '@utils/api/organizations/putOrganization'
import { getOptionalString, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostOrganizationProps

type PutFormState = FormState | PutOrganizationProps


function extractOrganizationProps<T extends PostOrganizationProps | PutOrganizationProps>(formData: FormData): T {
    return {
        description_en: getRequiredString(formData, 'description_en'),
        description_no: getRequiredString(formData, 'description_no'),
        link_facebook:  getOptionalString(formData, 'link_facebook'),
        link_homepage:  getOptionalString(formData, 'link_homepage'),
        link_instagram: getOptionalString(formData, 'link_instagram'),
        link_linkedin:  getOptionalString(formData, 'link_linkedin'),
        logo:           getOptionalString(formData, 'logo'),
        name_en:        getRequiredString(formData, 'name_en'),
        name_no:        getRequiredString(formData, 'name_no'),
    } as T
}

export async function createOrganization(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const organizationProps = extractOrganizationProps<PostOrganizationProps>(formData)

        const response = await postOrganization(organizationProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateOrganization(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const organizationProps = extractOrganizationProps<PutOrganizationProps>(formData)

        const id = Number(formData.get('id'))

        const response = await putOrganization(id, organizationProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}
