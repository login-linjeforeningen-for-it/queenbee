'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getChannels(): Promise<ChannelResponse[] | string> {
    return await getWrapper({
        path: 'channels',
        service: 'bot'
    })
}
