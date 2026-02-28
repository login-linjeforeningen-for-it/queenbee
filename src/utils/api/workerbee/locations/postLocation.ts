'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postLocation(body: PostLocationProps): Promise<PostLocationProps | string> {
    return await postWrapper({
        path: 'locations',
        data: body,
        service: 'workerbee'
    })
}
