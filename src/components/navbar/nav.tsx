import Image from 'next/image'
import ThemeSwitch from '../theme/themeSwitch'
import Link from 'next/link'
import Login from '@components/svg/login'
import Logout from '@components/svg/logout'


export default function Nav() {
    return (
        <nav className='relative w-full bg-black flex justify-between'>
            <LeftSide />
            <RightSide />
        </nav>
    )
}

function LeftSide() {
    return (
        <div className='flex gap-4'>
            <div className='relative h-[45px] w-[45px]'>
                <Link
                    href={'/'}    
                >
                    <Image alt='Logo' src='/images/queenbee-logo.png' fill={true} quality={100} />
                </Link>
            </div>
            <h1 className='self-center font-semibold text-white'>QUEENBEE - Admintool</h1>
        </div>
    )
}

function RightSide() {
    const loggedIn = false 

    return (
        <div className='flex gap-[1rem] items-center pr-[1rem]'>
            <ThemeSwitch />
            <Link className='flex gap-[0.5rem] hover:*:text-login hover:*:fill-login' href={loggedIn ? '/logout' : '/login'}>
                {loggedIn ? <h1>Logg ut</h1> : <h1 className='text-white'>Logg inn</h1>}
                {loggedIn ? <Logout className='fill-white w-[1.5rem]' /> : <Login className='fill-white w-[1.5rem]'/>}
            </Link>
        </div>
    )
}
