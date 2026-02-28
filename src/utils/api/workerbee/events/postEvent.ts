'use server'

import { postWrapper } from '@utils/apiWrapper'

export default async function postEvent(
    body: PostEventProps,
    repeat_type?: string,
    repeat_until?: string
): Promise<PostEventProps | string> {
    const queryParts = new URLSearchParams()
    if (repeat_type) {
        queryParts.append('repeat_type', String(repeat_type))
    }

    if (repeat_until) {
        queryParts.append('repeat_until', String(repeat_until))
    }

    return await postWrapper({
        path: `events?${queryParts.toString()}`,
        data: body,
        service: 'workerbee'
    })
}
