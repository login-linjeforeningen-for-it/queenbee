'use server'

import { getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostBeeformedProps

type PutFormState = FormState | PutBeeformedProps


function extractBeeformedProps<T extends PostBeeformedProps | PutBeeformedProps>(formData: FormData): T {
    return {
        title: getRequiredString(formData, 'title')
    } as T
}


export async function createForm(_: PostFormState, formData: FormData): Promise<PostFormState> {
    return extractBeeformedProps<PostBeeformedProps>(formData)
}

export async function updateForm(_: PutFormState, formData: FormData): Promise<PutFormState> {
    return extractBeeformedProps<PutBeeformedProps>(formData)
}