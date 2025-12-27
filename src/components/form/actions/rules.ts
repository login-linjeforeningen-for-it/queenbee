'use server'

import postRule from '@utils/api/workerbee/rules/postRule'
import putRule from '@utils/api/workerbee/rules/putRule'
import { getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostRuleProps

type PutFormState = FormState | PutRuleProps


function extractRuleProps<T extends PostRuleProps | PutRuleProps>(formData: FormData): T {
    return {
        name_en:        getRequiredString(formData, 'name_en'),
        name_no:        getRequiredString(formData, 'name_no'),
        description_en: getRequiredString(formData, 'description_en'),
        description_no: getRequiredString(formData, 'description_no'),
    } as T
}

export async function createRule(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const ruleProps = extractRuleProps<PostRuleProps>(formData)

        const response = await postRule(ruleProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateRule(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const ruleProps = extractRuleProps<PutRuleProps>(formData)

        const id = Number(formData.get('id'))

        const response = await putRule(id, ruleProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}
