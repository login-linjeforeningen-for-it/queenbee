'use server'

import config from '@config'
import { postWrapper } from '@utils/apiWrapper'

export default async function postAlert(body: PostAlertProps): Promise<PostAlertProps | string> {
    return await postWrapper({ path: config.workerbee.alerts.path, data: body })
}
