'use server'

import { putAlbum, postAlbum } from '@utils/api'
import { getOptionalNumber, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostAlbumProps

type PutFormState = FormState | PutAlbumProps


function extractAlbumProps<T extends PostAlbumProps | PutAlbumProps>(formData: FormData): T {
    return {
        name_en:        getRequiredString(formData, 'name_en'),
        name_no:        getRequiredString(formData, 'name_no'),
        description_en: getRequiredString(formData, 'description_en'),
        description_no: getRequiredString(formData, 'description_no'),
        year:           getOptionalNumber(formData, 'year'),
        event_id:       getOptionalNumber(formData, 'event_id'),
    } as T
}

export async function createAlbum(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const albumProps = extractAlbumProps<PostAlbumProps>(formData)

        const response = await postAlbum(albumProps)

        return response
    } catch (error) {
        console.log('Error creating album:', error)
        throw error
    }
}

export async function updateAlbum(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const albumProps = extractAlbumProps<PutAlbumProps>(formData)

        const id = Number(formData.get('id'))

        const response = await putAlbum(id, albumProps)
        return response
    } catch (error) {
        console.log('Error updating album:', error)
        throw error
    }
}