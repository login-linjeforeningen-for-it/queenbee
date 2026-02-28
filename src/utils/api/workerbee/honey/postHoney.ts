'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postHoney(body: PostHoneyProps): Promise<PostHoneyProps | string> {
    return await postWrapper({
        path: 'honeys',
        data: body,
        service: 'workerbee'
    })
}
