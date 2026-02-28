'use server'

import { getWrapper } from '@utils/apiWrapper'

export default async function getInternalDashboard(): Promise<InternalDashboard> {
    const data = await getWrapper({
        path: 'dashboard/internal',
        service: 'beekeeper'
    })

    if (typeof data === 'string') {
        return {
            statistics: {
                alerts: 0,
                backups: 0,
                sites: 0,
                kubernetes: 0,
                monitored: 0,
                requestsToday: 0
            },
            information: {
                primarySite: {
                    id: 0,
                    name: 'No primary site',
                    ip: '0.0.0.0'
                },
                system: {
                    ram: 'No RAM',
                    processes: 0,
                    disk: 'No disk',
                    load: 'No load',
                    containers: 0
                }
            }
        }
    }

    return data
}
