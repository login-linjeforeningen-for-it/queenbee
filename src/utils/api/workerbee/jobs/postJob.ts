'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postJob(body: PostJobProps): Promise<PostJobProps | string> {
    return await postWrapper({
        path: 'jobs',
        data: body,
        service: 'workerbee'
    })
}
