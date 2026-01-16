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
                sticky top-0 z-50 h-(--h-navbar) w-full
                bg-login-950/80 backdrop-blur-md border-b border-login-100/10 flex justify-between items-center px-4 shadow-sm
            `}
        >
            <LeftSide token={token} />
            <RightSide token={token} docker={docker} meta={meta} />
        </nav>
    )
}

function LeftSide({ token }: { token: string | undefined }) {
    return (
        <div className='flex gap-4 h-full items-center'>
            <Link
                href={token ? '/dashboard' : '/'}
                className='relative h-10 w-10 aspect-square hover:opacity-80 transition-opacity'
            >
                <Image
                    alt='Logo'
                    src='/images/queenbee-logo.png'
                    fill={true}
                    quality={100}
                    priority
                    sizes='40px'
                    className='object-contain'
                />
            </Link>
            <h1 className='font-bold text-lg tracking-wide hidden sm:block! text-login-50'>
                QueenBee <span className='font-normal text-login-200 text-base'>- Management tool</span>
            </h1>
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
        <div className='flex gap-1 items-center'>
            <ThemeToggle />
            <div className='md:hidden absolute z-100 w-full left-0 top-(--h-navbar)'>
                {sidebar && (isInternal ? <SidebarInternal meta={meta} docker={docker} /> : <Sidebar />)}
            </div>
            {token ? (
                <>
                    {groups && groups.includes('TekKom') && (
                        <Link
                            className={`
                                flex items-center justify-center p-2 rounded-md 
                                transition-colors hover:bg-login-50/10 size-12
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
                            hover:bg-login-50/10 size-12 transition-colors
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
                            flex items-center justify-center p-2 rounded-md
                            hover:bg-login-50/10 size-12 transition-colors
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
