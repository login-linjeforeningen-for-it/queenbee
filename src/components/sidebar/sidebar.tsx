'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    BriefcaseBusiness,
    Building2,
    Calendar,
    Gavel,
    Icon,
    LayoutDashboard,
    MapPin,
    Megaphone,
    Smartphone,
} from 'lucide-react'
import { hexagons7 } from '@lucide/lab'
import config from '@config'

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
                            'duration-[500ms] transition-[padding] ' +
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
            {typeof config.version !== 'undefined' ? (
                <div className='absolute w-full bottom-4 flex justify-center'>
                    <Link
                        className={
                            'inline-flex items-center gap-3 px-4 py-2 rounded-xl mx-4 ' +
                            'bg-login-700 border-2 border-login-500 ' +
                            'text-white text-center tracking-wide font-bold'
                        }
                        target='_blank'
                        href={`${config.url.GITLAB_URL}/tekkom/web/beehive/queenbee/-/tags/${config.version}`}
                        aria-label={`Queenbee version ${config.version}`}
                    >
                        <span className='hidden md:inline'>Version</span>
                        <span className='bg-login-800 text-login-50 px-2 py-0.5 rounded-lg font-mono border border-login-400'>
                            {config.version}
                        </span>
                    </Link>
                </div>
            ) : null}
        </div>
    )
}
