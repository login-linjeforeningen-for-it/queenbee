'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getLogs(params?: URLSearchParams | Record<string, string | number | undefined>) {
    const query = params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(Object.entries(params || {}).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value)
            }
            return acc
        }, {})).toString()

    return await getWrapper({
        path: query ? `docker/logs?${query}` : 'docker/logs',
        service: 'internal'
    })
}
