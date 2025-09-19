'use server'

import { putRule, postRule } from '@utils/api'

export type FormState =
    | null
    | string
    | PostRuleProps
    | PutRuleProps

export async function createRule(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const ruleProps: PostRuleProps = {
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
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
            id: Number(formData.get('id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            description_en: formData.get('description_en') as string,
            description_no: formData.get('description_no') as string,
        }

        const response = await putRule(ruleProps)
        return response
    } catch (error) {
        console.log('Error updating rule:', error)
        throw error
    }
}