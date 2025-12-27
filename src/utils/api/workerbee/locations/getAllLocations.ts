'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getAllLocations(): Promise<GetAllLocationsProps | string> {
    const path = `${config.workerbee.locations.path}/all/`
    return await getWrapper({ path, service: 'workerbee' })
}
