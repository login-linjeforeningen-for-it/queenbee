import Image from 'next/image'
import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import Logout from '@components/svg/logout'
import { cookies } from 'next/headers'

export default function Nav() {
    return (
        <nav className='relative h-[var(--h-navbar)] w-full bg-black flex justify-between'>
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
                    <Image alt='Logo' src='/images/queenbee-logo.png' fill={true} quality={100} />
                </Link>
            </div>
            <h1 className='self-center font-semibold text-white'>QUEENBEE - Admintool</h1>
        </div>
    )
}

async function RightSide() {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || undefined
    return (
        <div className='flex gap-[1rem] items-center pr-[1rem]'>
            <ThemeSwitch />
            {token ? <Link className='flex gap-[0.5rem] hover:*:text-login hover:*:fill-login' href={token ? '/logout' : '/login'}>
                <h1 className='text-white'>Logout</h1>
                <Logout className='fill-white w-[1.5rem]' />
            </Link> : <></>}
        </div>
    )
}
