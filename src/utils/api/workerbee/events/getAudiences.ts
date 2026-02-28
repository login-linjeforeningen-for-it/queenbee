'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getAudiences(): Promise<GetAudiencesProps | string> {
    return await getWrapper({
        path: 'audiences',
        service: 'workerbee'
    })
}
