'use server'

import postNotification from '@utils/api/beekeeper/services/postNotification'
import putNotification from '@utils/api/beekeeper/services/putNotification'
import { getRequiredString } from '@utils/validate'

type FormState = string | { success: true } | null

export async function createNotification(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const result = await postNotification({
            name: getRequiredString(formData, 'name'),
            message: getRequiredString(formData, 'message'),
            webhook: getRequiredString(formData, 'webhook'),
        })
        if (typeof result === 'string') return result
        return { success: true }
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateNotification(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const id = Number(formData.get('id'))
        const result = await putNotification(id, {
            name: getRequiredString(formData, 'name'),
            message: getRequiredString(formData, 'message'),
            webhook: getRequiredString(formData, 'webhook'),
        })
        if (typeof result === 'string') return result
        return { success: true }
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}
