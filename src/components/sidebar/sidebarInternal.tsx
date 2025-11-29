'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Server
} from 'lucide-react'
import SidebarVersion from './sidebarVersion'
import { useEffect, useState } from 'react'
import { getDocker } from '@utils/api'
import PulseDot from '@components/pulse/pulse'

export default function Sidebar({ docker: serverDocker }: { docker: Docker }) {
    const path = usePathname()
    const [docker, setDocker] = useState(serverDocker)

    useEffect(() => {
        setInterval(async() => {
            const updatedDocker = await getDocker()
            if (updatedDocker) {
                setDocker(updatedDocker)
            }
        }, 5000)
    }, [])

    const paths = {
        dashboard: {
            name: 'Dashboard',
            path: '/internal',
            image: <LayoutDashboard className='w-6' />
        },
        system: {
            name: 'System',
            path: '/internal/system',
            image: <Server className='w-6' />,
            status: <PulseDot status={docker.status} />
        }
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
