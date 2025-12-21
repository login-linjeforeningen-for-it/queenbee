'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Activity,
    Database,
    LayoutDashboard,
    Scale,
    Server,
    TriangleAlert,
    Waypoints
} from 'lucide-react'
import SidebarVersion from './sidebarVersion'
import { useEffect, useState } from 'react'
import { getDocker } from '@utils/api'
import PulseDot from '@components/pulse/pulse'
import { ServiceStatus } from '@utils/interfaces'

export default function Sidebar({ docker: serverDocker, meta: serverMeta }: { docker: Docker, meta: ServiceStatus }) {
    const path = usePathname()
    const [docker, setDocker] = useState(serverDocker)
    const color = {
        operational: 'bg-green-500',
        degraded: 'bg-login',
        down: 'bg-red-500',
        inactive: 'bg-login-300',
    }[serverMeta] || 'bg-gray-500'

    useEffect(() => {
        setInterval(async() => {
            const updatedDocker = await getDocker()
            if (updatedDocker) {
                setDocker(updatedDocker)
            }
        }, 30000)
    }, [])

    const paths = {
        dashboard: {
            name: 'Dashboard',
            path: '/internal',
            image: <LayoutDashboard className='w-6' />
        },
        alerts: {
            name: 'Alerts',
            path: '/internal/alerts',
            image: <TriangleAlert className='w-6' />,
        },
        backup: {
            name: 'Backup',
            path: '/internal/backup',
            image: <Database className='w-6' />,
        },
        loadbalancing: {
            name: 'Load Balancing',
            path: '/internal/loadbalancing',
            image: <Scale className='w-6' />,
        },
        kubernetes: {
            name: 'Kubernetes',
            path: '/internal/kubernetes',
            image: <Server className='w-6' />,
            status: <PulseDot color={color} />
        },
        status: {
            name: 'Status',
            path: '/internal/status',
            image: <Activity className='w-6' />
        },
        system: {
            name: 'System',
            path: '/internal/system',
            image: <Server className='w-6' />,
            status: <PulseDot status={docker.status} />
        },
        traffic: {
            name: 'Traffic',
            path: '/internal/traffic',
            image: <Waypoints className='w-6' />
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
                            'duration-300 transition-all justify-between ' +
                            `${
                                path === value.path
                                    ? '*:stroke-login text-login pl-[1.2rem] ' +
                                    'bg-login-800 border-l-[0.3rem]'
                                    : ''
                            } hover:*:stroke-login hover:text-login font-medium`
                        }
                    >
                        <div className='flex gap-2 items-center'>
                            {value.image}
                            {value.name}
                        </div>
                        <div>{'status' in value && value.status}</div>
                    </Link>
                ))}
            </div>
            <SidebarVersion />
        </div>
    )
}
