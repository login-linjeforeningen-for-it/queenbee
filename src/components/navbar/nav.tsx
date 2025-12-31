'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getCookie } from 'utilbee/utils'
import { LogOut, Menu, Shield, ShieldOff, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeToggle from './theme'
import Sidebar from '@components/sidebar/sidebar'
import SidebarInternal from '@components/sidebar/sidebarInternal'
import { ServiceStatus } from '@utils/interfaces'

export default function Nav({ docker, meta }: { docker: Docker, meta: ServiceStatus }) {
    const [token, setToken] = useState<string | undefined>(undefined)


    useEffect(() => {
        setToken(getCookie('access_token') || undefined)
    }, [])

    return (
        <nav
            className={`
                relative h-(--h-navbar) w-full
                bg-login-950 flex justify-between
            `}
        >
            <LeftSide token={token} />
            <RightSide token={token} docker={docker} meta={meta} />
        </nav>
    )
}

function LeftSide({ token }: { token: string | undefined }) {
    return (
        <div className='flex gap-4 h-(--h-navbar)'>
            <Link
                href={token ? '/dashboard' : '/'}
                className='relative h-full aspect-square'
            >
                <Image
                    alt='Logo'
                    src='/images/queenbee-logo.png'
                    fill={true}
                    quality={100}
                    sizes='(max-width: 400px) 40vw, 40vw'
                />
            </Link>
            <h1 className='self-center font-semibold '>QUEENBEE - Admintool</h1>
        </div>
    )
}

function RightSide({ token, docker, meta }: { token: string | undefined, docker: Docker, meta: ServiceStatus }) {
    const [groups, setGroups] = useState<string | undefined>(undefined)
    const [sidebar, setSidebar] = useState(false)
    const pathname = usePathname()
    const isInternal = pathname.startsWith('/internal')

    useEffect(() => {
        setGroups(getCookie('user_groups') || undefined)
    }, [])

    return (
        <div className='flex gap-1 items-center pr-4'>
            <ThemeToggle />
            <div className='md:hidden absolute z-100 w-full h-full top-14 left-0'>
                {sidebar && (isInternal ? <SidebarInternal meta={meta} docker={docker} /> : <Sidebar />)}
            </div>
            {token ? (
                <>
                    {groups && groups.includes('TekKom') && (
                        <Link
                            className={`
                                flex items-center justify-center p-2 rounded-md 
                                transition-colors hover:bg-login-50/5 size-12
                            `}
                            href={pathname.startsWith('/internal') ? '/dashboard' : '/internal'}
                            prefetch={false}
                        >
                            {pathname.startsWith('/internal') ? <ShieldOff className='w-5' /> : <Shield className='w-5' />}
                        </Link>
                    )}
                    <Link
                        className={`
                            flex items-center justify-center p-2 rounded-md
                            hover:bg-login-50/5 size-12 transition-colors
                        `}
                        href='/api/logout'
                        onClick={() => {
                            const router = useRouter()
                            router.push('/api/logout')
                        }}
                        prefetch={false}
                    >
                        <LogOut className='w-5' />
                    </Link>
                    <button
                        className={`
                            flex items-center justify-center p-2 pr-4 rounded-md
                            hover:bg-login-50/5 size-12 transition-colors
                            md:hidden!
                        `}
                        onClick={() => setSidebar(prev => !prev)}
                    >
                        {sidebar ? <X /> : <Menu />}
                    </button>
                </>
            ) : <></>}
        </div>
    )
}
