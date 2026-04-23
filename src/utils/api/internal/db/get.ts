'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getDatabaseOverview(): Promise<GetDatabaseOverview | string> {
    return await getWrapper({
        path: 'db',
        service: 'beekeeper',
        options: {
            cache: 'no-store',
        }
    })
}
