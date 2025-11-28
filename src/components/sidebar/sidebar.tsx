'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
    Server,
    Smartphone,
    TriangleAlert,
} from 'lucide-react'
import { hexagons7 } from '@lucide/lab'
import SidebarVersion from './sidebarVersion'

export default function Sidebar() {
    const path = usePathname()

    const paths = {
        dashboard: {
            name: 'Dashboard',
            path: '/dashboard',
            image: <LayoutDashboard className='w-6' />,
        },
        announce: {
            name: 'Announcements',
            path: '/announcements',
            image: <Megaphone className='w-6' />,
        },
        albums: {
            name: 'Albums',
            path: '/albums',
            image: <Images className='w-6' />,
        },
        alerts: {
            name: 'Alerts',
            path: '/alerts',
            image: <TriangleAlert className='w-6' />,
        },
        events: {
            name: 'Events',
            path: '/events',
            image: <Calendar className='w-6' />,
        },
        honeys: {
            name: 'Honeys',
            path: '/honeys',
            image: <Icon iconNode={hexagons7} className='w-6' />,
        },
        internal: {
            name: 'Internal',
            path: '/internal',
            image: <Server className='w-6' />,
        },
        jobs: {
            name: 'Jobs',
            path: '/jobs',
            image: <BriefcaseBusiness className='w-6' />,
        },
        locations: {
            name: 'Locations',
            path: '/locations',
            image: <MapPin className='w-6' />,
        },
        nucleus: {
            name: 'Nucleus',
            path: '/nucleus',
            image: <Smartphone className='w-6' />,
        },
        organizations: {
            name: 'Organizations',
            path: '/organizations',
            image: <Building2 className='w-6' />,
        },
        rules: {
            name: 'Rules',
            path: '/rules',
            image: <Gavel className='w-6' />,
        },
    }

    return (
        <div className='relative'>
            <div className={'h-full min-w-(--w-sidebar) bg-login-900 flex flex-col pt-2 overflow-x-scroll gap-[0.2rem]'} >
                {Object.entries(paths).map(([, value], index) => (
                    <Link
                        key={index}
                        href={value.path}
                        className={
                            'flex flex-row px-4 items-center ' +
                            'gap-2 py-[0.8rem] hover:pl-6 ' +
                            'duration-300 transition-all ' +
                            `${
                                path === value.path
                                    ? '*:stroke-login text-login pl-[1.2rem] ' +
                                    'bg-login-800 border-l-[0.3rem]'
                                    : ''
                            } hover:*:stroke-login hover:text-login font-medium`
                        }
                    >
                        {value.image}
                        {value.name}
                    </Link>
                ))}
            </div>
            <SidebarVersion />
        </div>
    )
}
