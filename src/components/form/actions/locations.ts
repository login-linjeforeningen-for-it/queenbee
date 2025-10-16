'use server'

import { putLocation, postLocation } from '@utils/api'
import { getOptionalNumber, getOptionalString, getRequiredString } from '@utils/validate'

export type FormState =
    | null
    | string
    | PostLocationProps
    | PutLocationProps

export async function createLocation(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PostLocationProps = {
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
        }

        const response = await postLocation(locationProps)
        return response
    } catch (error) {
        console.log('Error creating location:', error)
        throw error
    }
}

export async function updateLocation(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PutLocationProps = {
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
        }

        const id = Number(formData.get('id'))


        const response = await putLocation(id, locationProps)
        return response
    } catch (error) {
        console.log('Error updating location:', error)
        throw error
    }
}