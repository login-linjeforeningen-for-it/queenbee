'use server'

import config from '@config'
import { getWrapper } from '@utils/apiWrapper'

export default async function getIngress(port: number): Promise<GetIngressProps> {
    const path = `${config.internal.ingress}/${port}`
    return await getWrapper({ path, service: 'internal' })
}
