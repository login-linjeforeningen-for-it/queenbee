'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getCookie } from '@utils/cookies'
import { LogOut, Shield, ShieldOff } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeToggle from './theme'

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
                />
            </Link>
            <h1 className='self-center font-semibold '>QUEENBEE - Admintool</h1>
        </div>
    )
}

function RightSide({token}: {token: string | undefined}) {
    const [groups, setGroups] = useState<string | undefined>(undefined)
    const pathname = usePathname()

    useEffect(() => {
        setGroups(getCookie('user_groups') || undefined)
    }, [])

    return (
        <div className='flex gap-1 items-center pr-4'>
            <ThemeToggle />
            {token ? (
                <>
                    {groups && groups.includes('TekKom') && (
                        <Link
                            className={
                                'flex items-center justify-center p-2 rounded-md transition-colors ' +
                                'hover:bg-login-600 size-12'
                            }
                            href={pathname.startsWith('/internal') ? '/dashboard' : '/internal'}
                            prefetch={false}
                        >
                            {pathname.startsWith('/internal') ? <ShieldOff className='w-5' /> : <Shield className='w-5' />}
                        </Link>
                    )}
                    <Link
                        className={
                            'flex items-center justify-center p-2 rounded-md transition-colors ' +
                            'hover:bg-login-600 size-12'
                        }
                        href='/api/logout'
                        onClick={() => {
                            const router = useRouter()
                            router.push('/api/logout')
                        }}
                        prefetch={false}
                    >
                        <LogOut className='w-5' />
                    </Link>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}
