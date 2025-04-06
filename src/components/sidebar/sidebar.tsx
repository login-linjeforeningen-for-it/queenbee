'use client'

import { usePathname } from 'next/navigation'
import BeeHive from '@components/svg/beehive'
import Dashboard from '@components/svg/dashboad'
import Events from '@components/svg/events'
import Jobs from '@components/svg/jobs'
import Locations from '@components/svg/locations'
import Nucleus from '@components/svg/nucleus'
import Organizations from '@components/svg/organizations'
import Rules from '@components/svg/rules'
import Link from 'next/link'

export default function Sidebar() {
    
    const path = usePathname()

    const paths = {
        dashboard: {
            name: 'Dashboard',
            path: '/',
            image: <Dashboard className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        beehive: {
            name: 'BeeHive',
            path: '/beehive',
            image: <BeeHive className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        nucleus: {
            name: 'Nucleus',
            path: '/nucleus',
            image: <Nucleus className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        events: {
            name: 'Events',
            path: '/events',
            image: <Events className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        jobs: {
            name: 'Jobs',
            path: '/jobs',
            image: <Jobs className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        organizations: {
            name: 'Organizations',
            path: '/organizations',
            image: <Organizations className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        locations: {
            name: 'Locations',
            path: '/locations',
            image: <Locations className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
        rules: {
            name: 'Rules',
            path: '/rules',
            image: <Rules className='fill-[var(--foreground)] w-[1.5rem]'/>
        },
    }

    return (
        <div className='h-full min-w-[var(--w-sidebar)] bg-sidebar flex flex-col overflow-hidden p-[1rem] gap-[1rem]'>
            {Object.entries(paths).map(([, value], index) => (
                <Link 
                    key={index}
                    href={value.path}
                    className={`flex flex-row items-center gap-[1rem] py-[0.25rem] hover:pl-[0.5rem] duration-[500ms] transition-[padding] ${path === value.path ? '*:fill-login text-login' : '' } hover:*:fill-login hover:text-login font-medium`}
                >
                    {value.image}
                    {value.name}
                </Link>
            ))}
        </div>
    )
}
