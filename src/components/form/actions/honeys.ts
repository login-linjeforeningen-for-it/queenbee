'use server'

import postHoney from '@utils/api/workerbee/honey/postHoney'
import putHoney from '@utils/api/workerbee/honey/putHoney'
import { getRequiredJSON, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostHoneyProps

type PutFormState = FormState | PutHoneyProps


function extractHoneyProps<T extends PostHoneyProps | PutHoneyProps>(formData: FormData): T {
    return {
        service:    getRequiredString(formData, 'service'),
        page:       getRequiredString(formData, 'page'),
        language:   getRequiredString(formData, 'language'),
        text:       JSON.stringify(getRequiredJSON(formData, 'text')),
    } as T
}

export async function createHoney(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const honeyProps = extractHoneyProps<PostHoneyProps>(formData)

        const response = await postHoney(honeyProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateHoney(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const honeyProps = extractHoneyProps<PutHoneyProps>(formData)

        const id = Number(formData.get('id'))


        const response = await putHoney(id, honeyProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}
