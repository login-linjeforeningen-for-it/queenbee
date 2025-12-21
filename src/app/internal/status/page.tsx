import { getNotifications } from '@utils/api'
import PageClient from './pageClient'

export default async function Page() {
    const serverNotifications = await getNotifications()
    const notifications = Array.isArray(serverNotifications) ? serverNotifications : []
    const items: ServiceRow[] = [
        {
            name: 'beekeeper',
            uptime: 87,
            enabled: true,
            tags: [],
            bars: [
                { status: 'up', date: '2025-01-01', message: 'OK' },
                { status: 'up', date: '2025-01-02', message: 'OK' },
                { status: 'up', date: '2025-01-03', message: 'OK' },
                { status: 'up', date: '2025-01-04', message: 'OK' },
                { status: 'up', date: '2025-01-05', message: 'OK' },
                { status: 'up', date: '2025-01-06', message: 'OK' },
                { status: 'up', date: '2025-01-07', message: 'OK' },
                { status: 'up', date: '2025-01-08', message: 'OK' },
                { status: 'up', date: '2025-01-09', message: 'OK' },
                { status: 'up', date: '2025-01-10', message: 'OK' },
                { status: 'up', date: '2025-01-11', message: 'OK' },
                { status: 'up', date: '2025-01-12', message: 'OK' },
                { status: 'up', date: '2025-01-13', message: 'OK' },
                { status: 'up', date: '2025-01-14', message: 'OK' },
                { status: 'up', date: '2025-01-15', message: 'OK' },
                { status: 'down', date: '2025-01-16', message: 'Outage detected' },
                { status: 'up', date: '2025-01-17', message: 'Recovered' },
                { status: 'up', date: '2025-01-18', message: 'OK' },
                { status: 'up', date: '2025-01-19', message: 'OK' },
                { status: 'up', date: '2025-01-20', message: 'OK' }
            ]
        },
        {
            name: 'queenbee',
            uptime: 95,
            enabled: true,
            tags: [],
            bars: [
                { status: 'up', date: '2025-01-01', message: 'OK' },
                { status: 'up', date: '2025-01-02', message: 'OK' },
                { status: 'up', date: '2025-01-03', message: 'OK' },
                { status: 'up', date: '2025-01-04', message: 'OK' },
                { status: 'up', date: '2025-01-05', message: 'OK' },
                { status: 'up', date: '2025-01-06', message: 'OK' },
                { status: 'up', date: '2025-01-07', message: 'OK' },
                { status: 'up', date: '2025-01-08', message: 'OK' },
                { status: 'up', date: '2025-01-09', message: 'OK' },
                { status: 'up', date: '2025-01-10', message: 'OK' },
                { status: 'up', date: '2025-01-11', message: 'OK' },
                { status: 'up', date: '2025-01-12', message: 'OK' },
                { status: 'up', date: '2025-01-13', message: 'OK' },
                { status: 'up', date: '2025-01-14', message: 'OK' },
                { status: 'up', date: '2025-01-15', message: 'OK' },
                { status: 'down', date: '2025-01-16', message: 'Network issue' },
                { status: 'down', date: '2025-01-17', message: 'Network issue' },
                { status: 'up', date: '2025-01-18', message: 'Recovered' },
                { status: 'up', date: '2025-01-19', message: 'OK' },
                { status: 'up', date: '2025-01-20', message: 'OK' }
            ]
        },
        {
            name: 'scouterbee',
            uptime: 87,
            enabled: true,
            tags: [],
            bars: [
                { status: 'up', date: '2025-01-01', message: 'OK' },
                { status: 'up', date: '2025-01-02', message: 'OK' },
                { status: 'up', date: '2025-01-03', message: 'OK' },
                { status: 'up', date: '2025-01-04', message: 'OK' },
                { status: 'up', date: '2025-01-05', message: 'OK' },
                { status: 'pending', date: '2025-01-06', message: 'Deploying' },
                { status: 'pending', date: '2025-01-07', message: 'Deploying' },
                { status: 'pending', date: '2025-01-08', message: 'Deploying' },
                { status: 'pending', date: '2025-01-09', message: 'Deploying' },
                { status: 'up', date: '2025-01-10', message: 'OK' },
                { status: 'up', date: '2025-01-11', message: 'OK' },
                { status: 'up', date: '2025-01-12', message: 'OK' },
                { status: 'up', date: '2025-01-13', message: 'OK' },
                { status: 'up', date: '2025-01-14', message: 'OK' },
                { status: 'up', date: '2025-01-15', message: 'OK' },
                { status: 'up', date: '2025-01-16', message: 'OK' },
                { status: 'down', date: '2025-01-17', message: 'Crash detected' },
                { status: 'up', date: '2025-01-18', message: 'Recovered' },
                { status: 'up', date: '2025-01-19', message: 'OK' },
                { status: 'up', date: '2025-01-20', message: 'OK' }
            ]
        }
    ] as ServiceRow[]
    return <PageClient items={items} notifications={notifications} />
}
