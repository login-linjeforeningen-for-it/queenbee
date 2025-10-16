'use server'

import { putRule, postRule } from '@utils/api'
import { getRequiredString } from '@utils/validate'

export type FormState =
    | null
    | string
    | PostRuleProps
    | PutRuleProps

export async function createRule(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PostRuleProps = {
            name_en:        getRequiredString(formData, 'name_en'),
            name_no:        getRequiredString(formData, 'name_no'),
            description_en: getRequiredString(formData, 'description_en'),
            description_no: getRequiredString(formData, 'description_no'),
        }

        const response = await postRule(ruleProps)
        return response
    } catch (error) {
        console.log('Error creating rule:', error)
        throw error
    }
}

export async function updateRule(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PutRuleProps = {
            name_en:        getRequiredString(formData, 'name_en'),
            name_no:        getRequiredString(formData, 'name_no'),
            description_en: getRequiredString(formData, 'description_en'),
            description_no: getRequiredString(formData, 'description_no'),
        }

        const id = Number(formData.get('id'))

        const response = await putRule(id, ruleProps)
        return response
    } catch (error) {
        console.log('Error updating rule:', error)
        throw error
    }
}