import Image from 'next/image'
import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogOut } from 'lucide-react'

export default function Nav() {
    return (
        <nav
            className={
                'relative h-[var(--h-navbar)] w-full ' +
                'bg-login-950 flex justify-between'
            }
        >
            <LeftSide />
            <RightSide />
        </nav>
    )
}

function LeftSide() {
    return (
        <div className='flex gap-4'>
            <div className='relative h-[var(--h-navbar)] w-[45px]'>
                <Link href='/'>
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

async function RightSide() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || undefined
    return (
        <div className='flex gap-[1rem] items-center pr-[1rem]'>
            <ThemeSwitch />
            {token ? (
                <Link
                    className={
                        'flex align-middle gap-[0.5rem] ' +
                        'hover:*:text-login hover:*:stroke-login'
                    }
                    href='/api/logout'
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
