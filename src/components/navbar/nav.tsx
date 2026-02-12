'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getCookie } from 'utilbee/utils'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '@components/sidebar/sidebar'
import { ServiceStatus } from '@utils/interfaces'

export default function Nav({ docker, meta }: { docker: Docker, meta: ServiceStatus }) {
    const [token, setToken] = useState<string | undefined>(undefined)
    const [sidebar, setSidebar] = useState(false)

    useEffect(() => {
        setToken(getCookie('access_token') || undefined)
    }, [])

    if (!token) {
        return null
    }

    return (
        <nav
            className={`
                sticky top-0 z-50 h-(--h-navbar) w-full
                bg-login-950/80 backdrop-blur-md border-b border-login-100/10 flex justify-between items-center px-4 shadow-sm
            `}
        >
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
                <h1 className='font-bold text-lg tracking-wide text-login-50'>
                    QueenBee
                </h1>
            </div>

            <div className='flex gap-1 items-center'>
                <div className='absolute z-100 w-full left-0 top-(--h-navbar)'>
                    {sidebar && (<Sidebar docker={docker} meta={meta} mobile={true} />)}
                </div>
                {token ? (
                    <>
                        <button
                            className={`
                                flex items-center justify-center p-2 rounded-md
                                hover:bg-login-50/10 size-12 transition-colors
                            `}
                            onClick={() => setSidebar(prev => !prev)}
                        >
                            {sidebar ? <X /> : <Menu />}
                        </button>
                    </>
                ) : <></>}
            </div>
        </nav>
    )
}
