'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    BriefcaseBusiness,
    Building2,
    Calendar,
    ClipboardList,
    Gavel,
    Icon,
    LayoutDashboard,
    MapPin,
    Megaphone,
    Smartphone,
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
        beehive: {
            name: 'BeeHive',
            path: '/dashboard/beehive',
            image: <Icon iconNode={hexagons7} className='w-6' />,
        },
        nucleus: {
            name: 'Nucleus',
            path: '/dashboard/nucleus',
            image: <Smartphone className='w-6' />,
        },
        events: {
            name: 'Events',
            path: '/dashboard/events',
            image: <Calendar className='w-6' />,
        },
        jobs: {
            name: 'Jobs',
            path: '/dashboard/jobs',
            image: <BriefcaseBusiness className='w-6' />,
        },
        organizations: {
            name: 'Organizations',
            path: '/dashboard/organizations',
            image: <Building2 className='w-6' />,
        },
        locations: {
            name: 'Locations',
            path: '/dashboard/locations',
            image: <MapPin className='w-6' />,
        },
        rules: {
            name: 'Rules',
            path: '/dashboard/rules',
            image: <Gavel className='w-6' />,
        },
        announce: {
            name: 'Announcements',
            path: '/dashboard/announcements',
            image: <Megaphone className='w-6' />,
        },
        forms: {
            name: 'Forms',
            path: '/dashboard/beeformed',
            image: <ClipboardList className='w-6' />,
        },
    }

    return (
        <div className='relative'>
            <div className={'h-full min-w-[var(--w-sidebar)] bg-login-900 flex flex-col pt-[0.5rem] overflow-x-scroll gap-[0.2rem]'} >
                {Object.entries(paths).map(([, value], index) => (
                    <Link
                        key={index}
                        href={value.path}
                        className={
                            'flex flex-row px-[1rem] items-center ' +
                            'gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] ' +
                            'duration-[300ms] transition-all ' +
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
