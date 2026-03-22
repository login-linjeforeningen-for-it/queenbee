'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    BriefcaseBusiness,
    Building2,
    Calendar,
    Gavel,
    Icon,
    Images,
    LayoutDashboard,
    MapPin,
    Megaphone,
    Smartphone,
    Shield,
    Activity,
    Database,
    Logs,
    Scale,
    Server,
    TriangleAlert,
    Waypoints,
    ShieldOff,
    ShieldAlert
} from 'lucide-react'
import { hexagons7 } from '@lucide/lab'
import { getCookie } from 'utilbee/utils'
import SidebarLayout, { SidebarItem } from './sidebarLayout'
import PulseDot from '@components/pulse/pulse'
import { ServiceStatus } from '@utils/interfaces'
import getDocker from '@utils/api/internal/system/getDocker'
import getServiceMeta from '@utils/api/getServiceMeta'

type SidebarProps = {
    mobile?: boolean
    initialExpanded?: boolean
    initialHasToken?: boolean
}

export default function Sidebar({ mobile, initialExpanded = true, initialHasToken = false }: SidebarProps) {
    const [hasToken] = useState(initialHasToken)

    const [groups, setGroups] = useState<string | undefined>(undefined)
    const pathname = usePathname()
    const isInternal = pathname.startsWith('/internal')

    const [docker, setDocker] = useState<Docker | null>(null)
    const [meta, setMeta] = useState<ServiceStatus | null>(null)
    const color = meta ? {
        operational: 'bg-green-500',
        degraded: 'bg-login',
        down: 'bg-red-500',
        inactive: 'bg-login-300',
    }[meta] || 'bg-gray-500' : 'bg-gray-500'

    useEffect(() => {
        setGroups(getCookie('user_groups') || undefined)
        getDocker().then(d => { if (d) setDocker(d) })
        getServiceMeta().then(setMeta)

        if (isInternal) {
            const interval = setInterval(async () => {
                const updatedDocker = await getDocker()
                if (updatedDocker) {
                    setDocker(updatedDocker)
                }
            }, 30000)
            return () => clearInterval(interval)
        }
    }, [isInternal])

    if (!hasToken) {
        return null
    }

    const mainPaths: SidebarItem[] = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            image: <LayoutDashboard className='w-6' />,
        },
        {
            name: 'Announcements',
            path: '/announcements',
            image: <Megaphone className='w-6' />,
        },
        {
            name: 'Albums',
            path: '/albums',
            image: <Images className='w-6' />,
        },
        {
            name: 'Events',
            path: '/events',
            image: <Calendar className='w-6' />,
        },
        {
            name: 'Honey',
            path: '/honey',
            image: <Icon iconNode={hexagons7} className='w-6' />,
        },
        {
            name: 'Jobs',
            path: '/jobs',
            image: <BriefcaseBusiness className='w-6' />,
        },
        {
            name: 'Locations',
            path: '/locations?type=address',
            image: <MapPin className='w-6' />,
            items: [
                { name: 'Address', path: '/locations?type=address' },
                { name: 'Coordinate', path: '/locations?type=coordinate' },
                { name: 'Mazemap', path: '/locations?type=mazemap' },
                { name: 'Digital', path: '/locations?type=digital' },
            ]
        },
        {
            name: 'Nucleus',
            path: '/nucleus',
            image: <Smartphone className='w-6' />,
        },
        {
            name: 'Organizations',
            path: '/organizations',
            image: <Building2 className='w-6' />,
        },
        {
            name: 'Rules',
            path: '/rules',
            image: <Gavel className='w-6' />,
        },
    ]

    const internalPaths: SidebarItem[] = [
        {
            name: 'Dashboard',
            path: '/internal',
            image: <LayoutDashboard className='w-6' />
        },
        {
            name: 'Alerts',
            path: '/internal/alerts',
            image: <TriangleAlert className='w-6' />,
        },
        {
            name: 'Backup',
            path: '/internal/backup',
            image: <Database className='w-6' />,
            items: [
                { name: 'Status', path: '/internal/backup' },
                { name: 'Restore', path: '/internal/backup/restore' },
            ]
        },
        {
            name: 'Load Balancing',
            path: '/internal/loadbalancing',
            image: <Scale className='w-6' />,
        },
        {
            name: 'Logs',
            path: '/internal/logs',
            image: <Logs className='w-6' />,
        },
        {
            name: 'Kubernetes',
            path: '/internal/kubernetes',
            image: <Server className='w-6' />,
            status: <PulseDot color={color} />
        },
        {
            name: 'Monitoring',
            path: '/internal/monitoring',
            image: <Activity className='w-6' />
        },
        {
            name: 'Services',
            path: '/internal/services',
            image: <Server className='w-6' />,
            status: <PulseDot status={docker?.status} />
        },
        {
            name: 'Traffic',
            path: '/internal/traffic',
            image: <Waypoints className='w-6' />,
            items: [
                { name: 'Metrics', path: '/internal/traffic' },
                { name: 'Records', path: '/internal/traffic/records' },
                { name: 'Map', path: '/internal/traffic/map' },
            ]
        },
        {
            name: 'Vulnerabilities',
            path: '/internal/vulnerabilities',
            image: <ShieldAlert className='w-6' />
        }
    ]

    return (
        <SidebarLayout
            items={isInternal ? internalPaths : mainPaths}
            mobile={mobile}
            initialExpanded={initialExpanded}
            bottomAction={(expanded) => (
                groups && groups.includes('TekKom') ? (
                    <Link
                        href={isInternal ? '/dashboard' : '/internal'}
                        className={`
                        flex items-center p-3 rounded-lg w-full overflow-hidden
                        hover:bg-login-800 text-login-200 hover:text-login-100
                        transition-colors group
                    `}
                        title={!expanded ? (isInternal ? 'Dashboard' : 'Internal') : ''}
                    >
                        <div className={`
                            min-w-6 w-6 flex items-center justify-center transition-all duration-300
                            ${expanded ? '' : 'translate-x-1'}
                        `}>
                            {isInternal ? <ShieldOff className='w-6 min-w-6' /> : <Shield className='w-6 min-w-6' />}
                        </div>
                        <span
                            className={`
                            whitespace-nowrap overflow-hidden transition-all duration-300
                            ${expanded ? 'opacity-100 max-w-48 ml-3' : 'opacity-0 max-w-0 ml-0'}
                        `}
                        >
                            {isInternal ? 'Dashboard' : 'Internal'}
                        </span>
                    </Link>
                ) : <></>
            )}
        />
    )
}

