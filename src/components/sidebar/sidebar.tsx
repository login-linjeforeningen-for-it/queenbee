'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    BriefcaseBusiness,
    Building2,
    Calendar,
    Cloud,
    Gavel,
    Icon,
    Images,
    LayoutDashboard,
    LogOut,
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
    ShieldAlert,
    Bot,
    type LucideProps
} from 'lucide-react'
import { hexagons7 } from '@lucide/lab'
import { getCookie, setCookie } from 'utilbee/utils'
import { PulseDot, Sidebar as SidebarLayout, type SidebarItem } from 'uibee/components'
import SidebarVersion from './sidebarVersion'
import getDocker from '@utils/api/internal/system/getDocker'
import config from '@config'

function Hexagons7(props: LucideProps) {
    return <Icon iconNode={hexagons7} {...props} />
}

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

    useEffect(() => {
        setGroups(getCookie('user_groups') || undefined)
        getDocker().then(d => { if (d) setDocker(d) })

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
            icon: LayoutDashboard,
        },
        {
            name: 'Announcements',
            path: '/announcements',
            icon: Megaphone,
        },
        {
            name: 'Albums',
            path: '/albums',
            icon: Images,
        },
        {
            name: 'Events',
            path: '/events',
            icon: Calendar,
        },
        {
            name: 'Honey',
            path: '/honey',
            icon: Hexagons7,
        },
        {
            name: 'Jobs',
            path: '/jobs',
            icon: BriefcaseBusiness,
        },
        {
            name: 'Locations',
            path: '/locations?type=address',
            icon: MapPin,
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
            icon: Smartphone,
        },
        {
            name: 'Organizations',
            path: '/organizations',
            icon: Building2,
        },
        {
            name: 'Rules',
            path: '/rules',
            icon: Gavel,
        },
    ]

    const internalPaths: SidebarItem[] = [
        {
            name: 'Dashboard',
            path: '/internal',
            icon: LayoutDashboard
        },
        {
            name: 'AI',
            path: '/internal/ai',
            icon: Bot,
        },
        {
            name: 'Alerts',
            path: '/internal/alerts',
            icon: TriangleAlert,
        },
        {
            name: 'Databases',
            path: '/internal/db',
            icon: Database,
            items: [
                { name: 'Overview', path: '/internal/db' },
                { name: 'Backup', path: '/internal/db/backups' },
            ]
        },
        {
            name: 'S3',
            path: '/internal/s3',
            icon: Cloud,
        },
        {
            name: 'Load Balancing',
            path: '/internal/loadbalancing',
            icon: Scale,
        },
        {
            name: 'Logs',
            path: '/internal/logs',
            icon: Logs,
        },
        {
            name: 'Monitoring',
            path: '/internal/monitoring',
            icon: Activity,
            items: [
                { name: 'Services', path: '/internal/monitoring' },
                { name: 'Notifications', path: '/internal/monitoring/notifications' },
            ]
        },
        {
            name: 'Services',
            path: '/internal/services',
            icon: Server,
            status: <PulseDot variant={
                docker?.status === 'available' ? 'online' : docker?.status === 'unavailable' ? 'offline' : 'unknown'
            } />
        },
        {
            name: 'Traffic',
            path: '/internal/traffic',
            icon: Waypoints,
            items: [
                { name: 'Metrics', path: '/internal/traffic' },
                { name: 'Records', path: '/internal/traffic/records' },
                { name: 'Map', path: '/internal/traffic/map' },
            ]
        },
        {
            name: 'Vulnerabilities',
            path: '/internal/vulnerabilities',
            icon: ShieldAlert
        }
    ]

    return (
        <SidebarLayout
            items={isInternal ? internalPaths : mainPaths}
            mobile={mobile}
            initialExpanded={initialExpanded}
            onExpandedChange={(next) => setCookie('sidebar_expanded', String(next))}
            className={mobile ? 'h-[calc(100vh-var(--h-navbar))]' : ''}
            header={(expanded) => (
                <>
                    <div className='relative h-8 w-8 min-w-8'>
                        <Image
                            src='/images/queenbee-logo.png'
                            alt='QueenBee'
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                    <span className={`
                        font-bold text-lg tracking-wide text-login-50 whitespace-nowrap
                        overflow-hidden transition-all duration-300
                        ${expanded ? 'opacity-100 max-w-48' : 'opacity-0 max-w-0'}
                    `}>
                        QueenBee
                    </span>
                </>
            )}
            bottomAction={(expanded) => (
                <div className='flex flex-col gap-2'>
                    {groups && groups.includes('TekKom') && (
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
                    )}

                    <button
                        onClick={() => window.location.href = config.authPath.logout}
                        className={`
                            flex items-center p-3 rounded-lg w-full overflow-hidden
                            hover:bg-red-500/10 text-login-200 hover:text-red-400
                            transition-colors group
                        `}
                        title={!expanded ? 'Logout' : ''}
                    >
                        <div className={`
                            min-w-6 w-6 flex items-center justify-center transition-all duration-300
                            ${expanded ? '' : 'translate-x-1'}
                        `}>
                            <LogOut className='w-6 min-w-6' />
                        </div>
                        <span
                            className={`
                                whitespace-nowrap overflow-hidden transition-all duration-300
                                ${expanded ? 'opacity-100 max-w-48 ml-3' : 'opacity-0 max-w-0 ml-0'}
                            `}
                        >
                            Logout
                        </span>
                    </button>

                    <div
                        className={`
                            transition-all duration-300 ease-in-out overflow-hidden
                            ${expanded ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}
                        `}
                    >
                        <SidebarVersion />
                    </div>
                </div>
            )}
        />
    )
}
