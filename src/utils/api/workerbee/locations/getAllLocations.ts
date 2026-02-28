'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAllLocations(): Promise<GetAllLocationsProps | string> {
    return await getWrapper({
        path: 'locations/all',
        service: 'workerbee'
    })
}
