'use server'

import { postAlert, putAlert } from '@utils/api'
import { getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostAlertProps

type PutFormState = FormState | PutAlertProps


function extractAlertProps<T extends PostAlertProps | PutAlertProps>(formData: FormData): T {
    return {
        title_en:       getRequiredString(formData, 'title_en'),
        title_no:       getRequiredString(formData, 'title_no'),
        description_en: getRequiredString(formData, 'description_en'),
        description_no: getRequiredString(formData, 'description_no'),
        service:        getRequiredString(formData, 'service'),
        page:           getRequiredString(formData, 'page'),
    } as T
}

export async function createAlert(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const alertProps = extractAlertProps<PostAlertProps>(formData)

        const response = await postAlert(alertProps)
        return response
    } catch (error) {
        console.log('Error creating alert:', error)
        throw error
    }
}

export async function updateAlert(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const alertProps = extractAlertProps<PutAlertProps>(formData)

        const id = Number(formData.get('id'))

        const response = await putAlert(id, alertProps)
        return response
    } catch (error) {
        console.log('Error updating alert:', error)
        throw error
    }
}