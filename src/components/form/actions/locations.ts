'use server'

import postLocation from '@utils/api/workerbee/locations/postLocation'
import putLocation from '@utils/api/workerbee/locations/putLocation'
import { getOptionalNumber, getOptionalString, getRequiredString } from '@utils/validate'

type FormState =
    | null
    | string

type PostFormState = FormState | PostLocationProps

type PutFormState = FormState | PutLocationProps


function extractLocationProps<T extends PostLocationProps | PutLocationProps>(formData: FormData): T {
    return {
        address_postcode:   getOptionalNumber(formData, 'address_postcode'),
        address_street:     getOptionalString(formData, 'address_street'),
        city_name:          getOptionalString(formData, 'city_name'),
        coordinate_lat:     getOptionalNumber(formData, 'coordinate_lat'),
        coordinate_lon:     getOptionalNumber(formData, 'coordinate_long'),
        mazemap_campus_id:  getOptionalNumber(formData, 'mazemap_campus_id'),
        mazemap_poi_id:     getOptionalNumber(formData, 'mazemap_poi_id'),
        name_en:            getRequiredString(formData, 'name_en'),
        name_no:            getRequiredString(formData, 'name_no'),
        type:               getRequiredString(formData, 'type'),
        url:                getOptionalString(formData, 'url'),
    } as T
}

export async function createLocation(_: PostFormState, formData: FormData): Promise<PostFormState> {
    try {
        const locationProps = extractLocationProps<PostLocationProps>(formData)

        const response = await postLocation(locationProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}

export async function updateLocation(_: PutFormState, formData: FormData): Promise<PutFormState> {
    try {
        const locationProps = extractLocationProps<PutLocationProps>(formData)

        const id = Number(formData.get('id'))


        const response = await putLocation(id, locationProps)
        return response
    } catch (error) {
        return error instanceof Error ? error.message : 'Unknown error'
    }
}
