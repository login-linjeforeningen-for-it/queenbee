'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getChannels(): Promise<ChannelResponse[] | string> {
    const path = config.bot.channels
    return await getWrapper({ path, service: 'bot' })
}
