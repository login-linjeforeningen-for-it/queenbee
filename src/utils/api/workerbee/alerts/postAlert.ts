'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postAlert(body: PostAlertProps): Promise<PostAlertProps | string> {
    return await postWrapper({
        path: 'alerts',
        data: body,
        service: 'workerbee'
    })
}
