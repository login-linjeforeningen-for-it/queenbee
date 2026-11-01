'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'uibee/components'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@components/sidebar/sidebar'

export default function Nav() {
    const pathname = usePathname()
    const [openOn, setOpenOn] = useState<string | null>(null)
    const open = openOn === pathname

    return (
        <nav
            className={`
                sticky top-0 z-50 h-(--h-navbar) w-full
                bg-login-950/80 backdrop-blur-md border-b border-login-100/10 flex justify-between items-center px-4 shadow-sm
            `}
        >
            <div className='flex gap-4 h-full items-center'>
                <Link
                    href='/dashboard'
                    className='relative h-10 w-10 aspect-square hover:opacity-80 transition-opacity'
                >
                    <Image
                        alt='QueenBee dashboard'
                        src='/images/queenbee-logo.png'
                        fill={true}
                        quality={100}
                        priority
                        sizes='40px'
                        className='object-contain'
                    />
                </Link>
                <span className='font-bold text-lg tracking-wide text-login-50'>
                    QueenBee
                </span>
            </div>

            <div className='flex gap-1 items-center'>
                <div className='absolute z-100 w-full left-0 top-(--h-navbar)'>
                    {open && (<Sidebar mobile={true} initialHasToken={true} />)}
                </div>
                <Button
                    variant='secondary'
                    icon={open ? <X /> : <Menu />}
                    label={open ? 'Close menu' : 'Open menu'}
                    onClick={() => setOpenOn(open ? null : pathname)}
                />
            </div>
        </nav>
    )
}
