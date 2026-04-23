'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getIngress(port: number): Promise<GetIngressProps> {
    return await getWrapper({
        path: `ingress/${port}`,
        service: 'beekeeper'
    })
}
