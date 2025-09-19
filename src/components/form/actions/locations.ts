'use server'

import { putLocation, postLocation } from '@utils/api'

export type FormState =
    | null
    | string
    | PostLocationProps
    | PutLocationProps

export async function createLocation(_: FormState, formData: FormData): Promise<FormState> {
    try {
        const locationProps: PostLocationProps = {
            address_postcode: Number(formData.get('address_postcode')),
            address_street: formData.get('address_street') as string,
            city_name: formData.get('city_name') as string,
            coordinate_lat: Number(formData.get('coordinate_lat')),
            coordinate_long: Number(formData.get('coordinate_long')),
            mazemap_campus_id: Number(formData.get('mazemap_campus_id')),
            mazemap_poi_id: Number(formData.get('mazemap_poi_id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            type: formData.get('type') as location_type,
            url: formData.get('url') as string,
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
            id: Number(formData.get('id')),
            address_postcode: Number(formData.get('address_postcode')),
            address_street: formData.get('address_street') as string,
            city_name: formData.get('city_name') as string,
            coordinate_lat: Number(formData.get('coordinate_lat')),
            coordinate_long: Number(formData.get('coordinate_long')),
            mazemap_campus_id: Number(formData.get('mazemap_campus_id')),
            mazemap_poi_id: Number(formData.get('mazemap_poi_id')),
            name_en: formData.get('name_en') as string,
            name_no: formData.get('name_no') as string,
            type: formData.get('type') as location_type,
            url: formData.get('url') as string,
        }

        const response = await putLocation(locationProps)
        return response
    } catch (error) {
        console.log('Error updating location:', error)
        throw error
    }
}