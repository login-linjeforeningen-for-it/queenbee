'use client'

import Image from 'next/image'
import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import { getCookie } from '@utils/cookies'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Nav() {
    const [token, setToken] = useState<string | undefined>(undefined)

    useEffect(() => {
        setToken(getCookie('access_token') || undefined)
    }, [])

    return (
        <nav
            className={
                'relative h-(--h-navbar) w-full ' +
                'bg-login-950 flex justify-between'
            }
        >
            <LeftSide token={token} />
            <RightSide token={token} />
        </nav>
    )
}

function LeftSide({token}: {token: string | undefined}) {
    return (
        <div className='flex gap-4'>
            <div className='relative h-(--h-navbar) w-[45px]'>
                <Link href={token ? '/dashboard' : '/'}>
                    <Image
                        alt='Logo'
                        src='/images/queenbee-logo.png'
                        fill={true}
                        quality={100}
                    />
                </Link>
            </div>
            <h1 className='self-center font-semibold '>QUEENBEE - Admintool</h1>
        </div>
    )
}

function RightSide({token}: {token: string | undefined}) {
    return (
        <div className='flex gap-4 items-center pr-4'>
            <ThemeSwitch />
            {token ? (
                <Link
                    className={
                        'flex align-middle gap-2 ' +
                        'hover:*:text-login hover:*:stroke-login'
                    }
                    href='/api/logout'
                    onClick={() => {
                        const router = useRouter()
                        router.push('/api/logout')
                    }}
                    prefetch={false}
                >
                    <LogOut className='w-5' />
                    <h1>Logout</h1>
                </Link>
            ) : (
                <></>
            )}
        </div>
    )
}
